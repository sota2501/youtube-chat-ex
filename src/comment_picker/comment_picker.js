import Ext from "../base/ext.js";
import YoutubeState from "../youtube/youtube_state.js";

export default class CommentPicker extends Ext {
	constructor(event, status, debug) {
		super(event, status, debug);
		this._event.listen("initialized", this._bind.init);
		this._event.listen("requestOptions", this._bind.registerOptions);
	}

	init() {
		this._status.addNew("CommentPicker", false, "auto");
		this._status.addNew("CommentPicker-opt-owner", true, "auto");
		this._status.addNew("CommentPicker-opt-verified", true, "auto");
		this._status.addNew("CommentPicker-opt-moderator", false, "auto");
		this._event.listen("statusChanged", this._bind.onStatusChanged);

		if (this._status.get("CommentPicker") && YoutubeState.isChatFrame()) {
			this.enable();
		}
	}

	registerOptions() {
		if (!YoutubeState.isChatFrame()) {
			return;
		}

		const options = [
			{
				type: "toggle",
				name: "CommentPicker",
				caption: "CommentPicker_Description",
				childrenTrue: [
					{
						type: "toggle",
						name: "CommentPicker-opt-owner",
						caption: "CommentPicker_Owner"
					},
					{
						type: "toggle",
						name: "CommentPicker-opt-verified",
						caption: "CommentPicker_Verified"
					},
					{
						type: "toggle",
						name: "CommentPicker-opt-moderator",
						caption: "CommentPicker_Moderator"
					}
				]
			}
		];

		this._event.dispatch("registerOptions", options, false);
	}

	onStatusChanged(changes) {
		if (!YoutubeState.isChatFrame()) {
			return;
		}

		if ("CommentPicker" in changes) {
			if (changes["CommentPicker"]) {
				this.enable();
			} else {
				this.disable();
			}
		} else if (this._status.get("CommentPicker")) {
			if (
				"CommentPicker-opt-owner" in changes ||
				"CommentPicker-opt-verified" in changes ||
				"CommentPicker-opt-moderator" in changes
			) {
				this.items_observers?.disconnect();
				this.addedItems.childNodes.forEach(node => {
					const replacement = this.baseItems.querySelector(`*[data-comment-id="${node.id}"]`);
					replacement.after(node);
					replacement.remove();
				});
				this.anchor = false;
				this.baseItems.childNodes.forEach(this._bind.processAddedNode);
				this.items_observers.observe(this.baseItems, { childList: true });
			}
		}
	}

	enable() {
		document.querySelector("yt-live-chat-app").setAttribute("ytcex-comment-picker", "");
		const wrapper = document.querySelector("#chat > #item-list");
		this.baseItems = wrapper.querySelector("#items");

		// 固定リストの作成
		const newWrapper = document.createElement("div");
		newWrapper.id = "item-list";
		newWrapper.classList.add("style-scope", "yt-live-chat-renderer");
		newWrapper.dataset.ytcex = "CommentPicker";
		wrapper.after(newWrapper);
		newWrapper.insertAdjacentHTML("beforeend", `
			<div id="live-chat-item-list-panel" class="style-scope yt-live-chat-renderer">
				<div id="contents" class="style-scope yt-live-chat-item-list-renderer">
					<div id="item-scroller" class="style-scope yt-live-chat-item-list-renderer animated">
						<div id="item-offset" class="style-scope yt-live-chat-item-list-renderer">
							<div id="items" class="style-scope yt-live-chat-item-list-renderer"></div>
						</div>
					</div>
				</div>
			</div>
		`);
		const ytIconButton = document.createElement("yt-icon-button");
		ytIconButton.id = "show-more";
		ytIconButton.classList.add("style-scope", "yt-live-chat-item-list-renderer");
		ytIconButton.style.visibility = "hidden";
		ytIconButton.setAttribute("disabled", "");
		newWrapper.querySelector("#contents").append(ytIconButton);
		const button = document.createElement("button");
		button.id = "button";
		button.classList.add("style-scope", "yt-icon-button");
		button.setAttribute("aria-label", "さらに下のコメントを表示");
		ytIconButton.append(button);
		const ytIcon = document.createElement("yt-icon");
		ytIcon.setAttribute("icon", "down_arrow");
		ytIcon.classList.add("style-scope", "yt-live-chat-item-list-renderer");
		button.append(ytIcon);
		this.addedItems = newWrapper.querySelector("#items");

		window.addEventListener("resize", this._bind.resizeEvent);
		this.addedItems.closest("#item-scroller").addEventListener("scroll", this._bind.scrollEvent);
		this.addedItems.closest("#item-scroller").nextElementSibling.addEventListener("click", this._bind.scrollBottom);

		this.anchor = false;
		this.baseItems.childNodes.forEach(this._bind.processAddedNode);
		if (!this.list_observers) {
			this.list_observers = new MutationObserver(this._bind.listCallback);
		}
		if (!this.items_observers) {
			this.items_observers = new MutationObserver(this._bind.itemsCallback);
		}
		this.list_observers.observe(wrapper, { childList: true });
		this.items_observers.observe(this.baseItems, { childList: true });
	}

	disable() {
		this.list_observers?.disconnect();
		this.items_observers?.disconnect();
		this.addedItems.closest("#item-scroller").nextElementSibling.removeEventListener("click", this._bind.scrollBottom);
		this.addedItems.closest("#item-scroller").removeEventListener("scroll", this._bind.scrollEvent);
		window.removeEventListener("resize", this._bind.resizeEvent);
		this.addedItems.childNodes.forEach(node => {
			const replacement = this.baseItems.querySelector(`*[data-comment-id="${node.id}"]`);
			replacement.after(node);
			replacement.remove();
		});
		document.querySelector("#item-list[data-ytcex=\"CommentPicker\"]").remove();
		document.querySelector("yt-live-chat-app").removeAttribute("ytcex-comment-picker");
	}

	listCallback(mutationList) {
		mutationList.forEach(mutation => {
			if (mutation.addedNodes.length) {
				this.baseItems = mutation.addedNodes[0].querySelector("#items");
				this.items_observers.observe(this.baseItems, { childList: true });
			} else if (mutation.removedNodes.length) {
				this.items_observers?.disconnect();
				while (this.addedItems.firstChild) this.addedItems.removeChild(this.addedItems.firstChild);
				const addedScroller = this.addedItems.closest("#item-scroller");
				if (addedScroller.scrollTop == addedScroller.scrollHeight - addedScroller.clientHeight) {
					this.scrollEvent();
				}
			}
		});
	}

	itemsCallback(mutationList) {
		mutationList.forEach(mutation => {
			mutation.addedNodes.forEach(this._bind.processAddedNode);
			mutation.removedNodes.forEach(this._bind.processRemovedNode);
		});
	}

	processAddedNode(node) {
		if (
			this._status.get("CommentPicker-opt-owner") && node.querySelector("#author-name.owner") ||
			this._status.get("CommentPicker-opt-verified") && node.querySelector("yt-live-chat-author-badge-renderer[type=\"verified\"]") ||
			this._status.get("CommentPicker-opt-moderator") && node.querySelector("yt-live-chat-author-badge-renderer[type=\"moderator\"]") ||
			this.anchor == true && !node.classList.contains("fixedComment")
		) {
			const liveAnchor = this._status.get("CommentPicker-opt-owner") && node.querySelector("#author-name.owner") && YoutubeState.isLiveStreaming();
			const prevCheck = elm => {
				if (elm.querySelector("#message").innerText.match(/\↑/g)) {
					prevCheck(elm.previousElementSibling);
					this.pickComment(elm.previousElementSibling);
				}
			};
			if (liveAnchor) {
				prevCheck(node);
			}
			if ((liveAnchor || this.anchor) && node.querySelector("#message").innerText.match(/\↓/g)) {
				this.anchor = true;
			} else {
				this.anchor = false;
			}
			this.pickComment(node);
		}
	}

	processRemovedNode(node) {
		if (node.classList.contains("fixedComment")) {
			const picked = this.addedItems.querySelector(`*[id="${node.dataset.commentId}"]`);
			if (picked) {
				picked.remove();
			}
			const addedScroller = this.addedItems.closest("#item-scroller");
			if (addedScroller.scrollTop == addedScroller.scrollHeight - addedScroller.clientHeight) {
				this.scrollEvent();
			}
		}
	}

	pickComment(elm) {
		const replacement = document.createElement("yt-live-chat-text-message-renderer");
		replacement.classList.add("fixedComment");
		replacement.dataset.commentId = elm.id;
		elm.after(replacement);
		replacement.querySelector("#content > #message").innerText = chrome.i18n.getMessage("CommentPicker_ReplaceText");
		replacement.querySelector("#menu").setAttribute("hidden", "");
		const addedScroller = this.addedItems.closest("#item-scroller");
		const scrolling = addedScroller.scrollTop < addedScroller.scrollHeight - addedScroller.clientHeight;
		this.addedItems.append(elm);
		const baseScroller = this.baseItems.closest("#item-scroller");
		baseScroller.scrollTo({ top: baseScroller.scrollHeight - baseScroller.clientHeight });
		if (!scrolling) {
			this.autoScrolling = addedScroller.scrollTop;
			addedScroller.scrollTo({ top: addedScroller.scrollHeight - addedScroller.clientHeight, behavior: "smooth" });
		}
	}

	scrollEvent() {
		const addedScroller = this.addedItems.closest("#item-scroller");
		if (this.autoScrolling !== false) {
			if (this.autoScrolling < addedScroller.scrollTop && addedScroller.scrollTop < addedScroller.scrollHeight - addedScroller.clientHeight) {
				this.autoScrolling = addedScroller.scrollTop;
			} else {
				this.autoScrolling = false;
			}
		} else {
			if (addedScroller.scrollTop == addedScroller.scrollHeight - addedScroller.clientHeight) {
				addedScroller.nextElementSibling.setAttribute("disabled", "");
				if (this.scrollButtonTimeoutId !== false) {
					clearTimeout(this.scrollButtonTimeoutId);
				}
				this.scrollButtonTimeoutId = setTimeout(() => {
					addedScroller.nextElementSibling.style.visibility = "hidden";
					this.userScrolling = false;
				}, 150);
			} else {
				if (this.scrollButtonTimeoutId !== false) {
					clearTimeout(this.scrollButtonTimeoutId);
				}
				addedScroller.nextElementSibling.removeAttribute("disabled");
				addedScroller.nextElementSibling.style.visibility = "visible";
				this.userScrolling = true;
			}
		}
	}

	resizeEvent(e) {
		const addedScroller = this.addedItems.closest("#item-scroller");
		if (!this.userScrolling) {
			this.autoScrolling = addedScroller.scrollTop;
			addedScroller.scrollTo({ top: addedScroller.scrollHeight - addedScroller.clientHeight, behavior: "smooth" });
		} else {
			this.scrollEvent();
		}
	}

	scrollBottom(e) {
		const addedScroller = this.addedItems.closest("#item-scroller");
		addedScroller.scrollTo({ top: addedScroller.scrollHeight - addedScroller.clientHeight });
	}
}
