import Ext from "../base/ext.js";
import YoutubeState from "../youtube/youtube_state.js";

export default class FullscreenChat extends Ext {
	constructor(event, status, debug) {
		super(event, status, debug);
		this._event.listen("initialized", this._bind.init);
		this._event.listen("requestOptions", this._bind.registerOptions);
	}

	init() {
		this._status.addNew("FullscreenChat", false, "auto");
		this._status.addNew("FullscreenChat-opt-text-outline", true, "auto");
		this._status.addNew("FullscreenChat-opt-font-size", 16, "auto");
		this._status.addNew("FullscreenChat-opt-background-blur", 2, "auto");
		this._status.addNew("FullscreenChat-opt-opacity-def", 0.6, "auto");
		this._status.addNew("FullscreenChat-opt-opacity-hover", 0.9, "auto");
		this._status.addNew("FullscreenChat-opt-use-card", true, "auto");
		this._status.addNew("FullscreenChat-opt-card-opacity-def", 0.9, "auto");
		this._status.addNew("FullscreenChat-opt-card-opacity-hover", 0.9, "auto");
		this._status.addNew("FullscreenChat-frame-chat-docking", true, "local");
		this._status.addNew("FullscreenChat-frame-top", 0, "local");
		this._status.addNew("FullscreenChat-frame-left", 0, "local");
		this._status.addNew("FullscreenChat-frame-width", 400, "local");
		this._status.addNew("FullscreenChat-frame-height", 600, "local");
		this._event.listen("statusChanged", this._bind.onStatusChanged);

		if (this._status.get("FullscreenChat")) {
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
				name: "FullscreenChat",
				caption: "FullscreenChat_Description",
				childrenTrue: [
					{
						v: 3,
						type: "text",
						caption: "FullscreenChat_FixedDescription",
						onlyLessThanV: 3
					},
					{
						type: "toggle",
						name: "FullscreenChat-opt-text-outline",
						caption: "FullscreenChat_TextOutline"
					},
					{
						type: "slider",
						name: "FullscreenChat-opt-font-size",
						caption: "FullscreenChat_FontSize",
						min: 8,
						max: 32,
						step: 1
					},
					{
						type: "slider",
						name: "FullscreenChat-opt-background-blur",
						caption: "FullscreenChat_BackgroundBlur",
						min: 0,
						max: 10,
						step: 1
					},
					{
						type: "slider",
						name: "FullscreenChat-opt-opacity-def",
						caption: "FullscreenChat_OpacityDef",
						min: 0,
						max: 1,
						step: 0.1
					},
					{
						type: "slider",
						name: "FullscreenChat-opt-opacity-hover",
						caption: "FullscreenChat_OpacityHover",
						min: 0,
						max: 1,
						step: 0.1
					},
					{
						type: "toggle",
						name: "FullscreenChat-opt-use-card",
						caption: "FullscreenChat_UseCard",
						childrenTrue: [
							{
								type: "slider",
								name: "FullscreenChat-opt-card-opacity-def",
								caption: "FullscreenChat_CardOpacityDef",
								min: 0,
								max: 1,
								step: 0.1
							},
							{
								type: "slider",
								name: "FullscreenChat-opt-card-opacity-hover",
								caption: "FullscreenChat_CardOpacityHover",
								min: 0,
								max: 1,
								step: 0.1
							}
						]
					},
					{
						type: "text",
						caption: "FullscreenChat_ChatDockingDescription",
						onlyLessThanInit: 3
					}
				],
				childrenFalse: [
					{
						v: 3,
						type: "text",
						caption: "FullscreenChat_FixedDescription",
						onlyLessThanInit: 3
					}
				]
			}
		];

		this._event.dispatch("registerOptions", options, false);
	}

	onStatusChanged(changes) {
		if ("FullscreenChat" in changes) {
			if (this._status.get("FullscreenChat")) {
				this.enable();
			} else {
				this.disable();
			}
		} else {
			if (YoutubeState.isIframeChatFrame()) {
				if ("FullscreenChat-opt-text-outline" in changes) {
					if (this._status.get("FullscreenChat-opt-text-outline")) {
						document.querySelector("yt-live-chat-app").setAttribute("ytcex-fullscreen-chat-text-outline", "");
					} else {
						document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat-text-outline");
					}
				}
				if ("FullscreenChat-opt-font-size" in changes) {
					document.documentElement.style.setProperty("--ytcex-fullscreen-chat-font-size", changes["FullscreenChat-opt-font-size"] + "px");
				}
				if ("FullscreenChat-opt-background-blur" in changes) {
					document.documentElement.style.setProperty("--ytcex-fullscreen-chat-background-blur", changes["FullscreenChat-opt-background-blur"] + "px");
				}
				if ("FullscreenChat-opt-opacity-def" in changes) {
					document.documentElement.style.setProperty("--ytcex-fullscreen-chat-opacity-def", changes["FullscreenChat-opt-opacity-def"]);
				}
				if ("FullscreenChat-opt-opacity-hover" in changes) {
					document.documentElement.style.setProperty("--ytcex-fullscreen-chat-opacity-hover", changes["FullscreenChat-opt-opacity-hover"]);
				}
				if ("FullscreenChat-opt-use-card" in changes) {
					if (changes["FullscreenChat-opt-use-card"]) {
						if ("FullscreenChat-opt-card-opacity-def" in changes) {
							document.documentElement.style.setProperty("--ytcex-fullscreen-chat-card-opacity-def", changes["FullscreenChat-opt-card-opacity-def"]);
						} else {
							document.documentElement.style.setProperty("--ytcex-fullscreen-chat-card-opacity-def", this._status.get("FullscreenChat-opt-card-opacity-def"));
						}
						if ("FullscreenChat-opt-card-opacity-hover" in changes) {
							document.documentElement.style.setProperty("--ytcex-fullscreen-chat-card-opacity-hover", changes["FullscreenChat-opt-card-opacity-hover"]);
						} else {
							document.documentElement.style.setProperty("--ytcex-fullscreen-chat-card-opacity-hover", this._status.get("FullscreenChat-opt-card-opacity-hover"));
						}
					} else {
						document.documentElement.style.setProperty("--ytcex-fullscreen-chat-card-opacity-def", 1);
						document.documentElement.style.setProperty("--ytcex-fullscreen-chat-card-opacity-hover", 1);
					}
				} else {
					if ("FullscreenChat-opt-card-opacity-def" in changes) {
						document.documentElement.style.setProperty("--ytcex-fullscreen-chat-card-opacity-def", changes["FullscreenChat-opt-card-opacity-def"]);
					}
					if ("FullscreenChat-opt-card-opacity-hover" in changes) {
						document.documentElement.style.setProperty("--ytcex-fullscreen-chat-card-opacity-hover", changes["FullscreenChat-opt-card-opacity-hover"]);
					}
				}
			}
		}
	}

	enable() {
		if(YoutubeState.isAppFrame()){
			document.querySelector("ytd-app").setAttribute("ytcex-fullscreen-chat", "");
			if (YoutubeState.isChatCollapsing()) {
				document.querySelector("ytd-app").setAttribute("ytcex-fullscreen-chat-chat-collapsing", "");
			}
			this._event.listen("yt-fullscreen", this._bind.fullscreenMainEvent);
			this._event.listen("yt-live-chat-collapsed", this._bind.chatCollapseMainEvent);
			this._event.listen("FullscreenChat-iframe-set", this._bind.loadMainEvent);
			this._event.listen("FullscreenChat-iframe-grab", this._bind.grabMainEvent);
			this._event.listen("FullscreenChat-iframe-ungrab", this._bind.ungrabMainEvent);
			this._event.listen("FullscreenChat-iframe-adjust-fixed-length", this._bind.adjustMainEvent);
			window.addEventListener("resize", this._bind.loadMainEvent);
			this.loadMainEvent();
			window.dispatchEvent(new Event("resize"));
		}else if(YoutubeState.isIframeChatFrame()){
			document.querySelector("yt-live-chat-app").setAttribute("ytcex-fullscreen-chat", "");
			if(this._status.get("FullscreenChat-opt-text-outline")){
				document.querySelector("yt-live-chat-app").setAttribute("ytcex-fullscreen-chat-text-outline", "");
			}
			document.documentElement.style.setProperty("--ytcex-fullscreen-chat-font-size", this._status.get("FullscreenChat-opt-font-size") + "px");
			document.documentElement.style.setProperty("--ytcex-fullscreen-chat-background-blur", this._status.get("FullscreenChat-opt-background-blur") + "px");
			document.documentElement.style.setProperty("--ytcex-fullscreen-chat-opacity-def", this._status.get("FullscreenChat-opt-opacity-def"));
			document.documentElement.style.setProperty("--ytcex-fullscreen-chat-opacity-hover", this._status.get("FullscreenChat-opt-opacity-hover"));
			if(this._status.get("FullscreenChat-opt-use-card")){
				document.documentElement.style.setProperty("--ytcex-fullscreen-chat-card-opacity-def", this._status.get("FullscreenChat-opt-card-opacity-def"));
				document.documentElement.style.setProperty("--ytcex-fullscreen-chat-card-opacity-hover", this._status.get("FullscreenChat-opt-card-opacity-hover"));
			}else{
				document.documentElement.style.setProperty("--ytcex-fullscreen-chat-card-opacity-def", 1);
				document.documentElement.style.setProperty("--ytcex-fullscreen-chat-card-opacity-hover", 1);
			}

			this.moving = false;

			// 移動アイコン追加
			const chatTypeBtn = document.querySelector("#chat-messages > yt-live-chat-header-renderer > #live-chat-header-context-menu");
			chatTypeBtn.insertAdjacentHTML("beforebegin", `
				<yt-live-chat-button id="ytcex-fullscreen-move" class="style-scope yt-live-chat-header-renderer" modern data-btn-id="0">
					<yt-button-renderer class="style-scope yt-live-chat-header-renderer" is-icon-button="" has-no-text=""></yt-button-renderer>
				</yt-live-chat-button>
			`);
			this.moveBtn = chatTypeBtn.parentElement.querySelector("#ytcex-fullscreen-move");
			const buttonRenderer = this.moveBtn.querySelector("yt-button-renderer");
			const script = document.createElement("script");
			script.src = chrome.runtime.getURL("fullscreen_chat/inline.js");
			buttonRenderer.appendChild(script);
			setTimeout(() => {
				const ytIcon = buttonRenderer.querySelector("button");
				ytIcon.insertAdjacentHTML("afterbegin", `
					<div aria-hidden="true" class="yt-spec-button-shape-next__icon">
						<span class="ytIconWrapperHost" style="width: 24px; height: 24px;">
							<span class="yt-icon-shape yt-spec-icon-shape">
								<div style="width: 100%; height: 100%; display: block; fill: currentcolor;">
									<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;">
										<path d="M12.5,12.5v7.086l2-2l.707,.707L12.5,21h-1l-2.707-2.707l.707-.707l2,2V12.5h-7.086l2,2l-.707,.707L3,12.5v-1l2.707-2.707l.707,.707l-2,2H11.5v-7.086l-2,2l-.707-.707L11.5,3h1l2.707,2.707l-.707,.707l-2-2V11.5h7.086l-2-2l.707-.707L21,11.5v1l-2.707,2.707l-.707-.707l2-2H12.5Z"></path>
									</svg>
								</div>
							</span>
						</span>
					</div>
				`);
				const button = buttonRenderer.querySelector("button");
				button.addEventListener("mousedown", this._bind.grabIframeEvent);
				button.addEventListener("touchstart", this._bind.grabIframeEvent);
			}, 1000);

			// リサイズ用ボタン追加
			this.resizeBtn = document.createElement("div");
			this.resizeBtn.id = "resizeButton";
			this.resizeBtn.setAttribute("data-ytcex", "FullscreenChat");
			for(let i = 0; i < 9; i++){
				const btn = document.createElement("button");
				btn.setAttribute("data-btn-id", i+1);
				btn.setAttribute("tabindex", "-1");
				this.resizeBtn.append(btn);
			}
			document.querySelector("yt-live-chat-app").append(this.resizeBtn);
			this.resizeBtn.addEventListener("mousedown", this._bind.grabIframeEvent);
			this.resizeBtn.addEventListener("touchstart", this._bind.grabIframeEvent);

			// フルスクリーン切り替え処理
			this._event.listen("yt-fullscreen", this._bind.fullscreenIframeEvent);
			this._event.listen("FullscreenChat-chat-docking", this._bind.setIframeChatDocking);
			this.fullscreenIframeEvent();

			if (YoutubeState.isIframeChatFrame()) {
				this._event.dispatch("FullscreenChat-iframe-set");
			}
		}
	}

	disable() {
		if(YoutubeState.isAppFrame()){
			document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat");
			document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-fullscreen");
			document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-chat-collapsing");
			document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-chat-docking");
			document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-chat-docking-guide");
			document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-chat-docking-guide-extend");
			this._event.unlisten("yt-fullscreen", this._bind.fullscreenMainEvent);
			this._event.unlisten("yt-live-chat-collapsed", this._bind.chatCollapseMainEvent);
			this._event.unlisten("FullscreenChat-iframe-set", this._bind.loadMainEvent);
			this._event.unlisten("FullscreenChat-iframe-grab", this._bind.grabMainEvent);
			this._event.unlisten("FullscreenChat-iframe-move", this._bind.moveMainEvent);
			this._event.unlisten("FullscreenChat-iframe-ungrab", this._bind.ungrabMainEvent);
			this._event.unlisten("FullscreenChat-iframe-adjust-fixed-length", this._bind.adjustMainEvent);
			window.removeEventListener("resize", this._bind.loadMainEvent);
			this.setIframe(false);
			window.dispatchEvent(new Event("resize"));
		}else if(YoutubeState.isIframeChatFrame()){
			document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat");
			document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat-text-outline");
			document.documentElement.style.removeProperty("--ytcex-fullscreen-chat-font-size");
			document.documentElement.style.removeProperty("--ytcex-fullscreen-chat-background-blur");
			document.documentElement.style.removeProperty("--ytcex-fullscreen-chat-opacity-def");
			document.documentElement.style.removeProperty("--ytcex-fullscreen-chat-opacity-hover");
			document.documentElement.style.removeProperty("--ytcex-fullscreen-chat-card-opacity-def");
			document.documentElement.style.removeProperty("--ytcex-fullscreen-chat-card-opacity-hover");

			this.moveBtn.remove();
			this.resizeBtn.remove();
			document.removeEventListener("mousemove", this._bind.moveIframeEvent);
			document.removeEventListener("mouseup", this._bind.ungrabIframeEvent);
			document.removeEventListener("touchmove", this._bind.moveIframeEvent);
			document.removeEventListener("touchend", this._bind.ungrabIframeEvent);
			document.removeEventListener("keydown", this._bind.adjustIframeEvent);
			document.removeEventListener("keyup", this._bind.adjustIframeEvent);

			this._event.unlisten("yt-fullscreen", this._bind.fullscreenIframeEvent);
			this._event.unlisten("FullscreenChat-chat-docking", this._bind.setIframeChatDocking);
			document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat-fullscreen");
			document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat-chat-docking");
		}
		const dom = document.querySelectorAll("[data-ytcex=\"FullscreenChat\"]");
		dom.forEach(e=>e.remove());
	}

	/* main */
	loadMainEvent() {
		this.setIframe(this._status.get("yt-fullscreen") && !YoutubeState.isChatCollapsing() && !this._status.get("FullscreenChat-frame-chat-docking"));
	}

	fullscreenMainEvent() {
		if (this._status.get("yt-fullscreen")) {
			document.querySelector("ytd-app").setAttribute("ytcex-fullscreen-chat-fullscreen", "");
		} else {
			document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-fullscreen");
		}
		if (!YoutubeState.isChatCollapsing()) {
			this.setIframe(this._status.get("yt-fullscreen") && !this._status.get("FullscreenChat-frame-chat-docking"), this._status.get("FullscreenChat-frame-chat-docking"));
		}
	}

	chatCollapseMainEvent() {
		if (YoutubeState.isChatCollapsing()) {
			document.querySelector("ytd-app").setAttribute("ytcex-fullscreen-chat-chat-collapsing", "");
		} else {
			document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-chat-collapsing");
		}
		if (this._status.get("yt-fullscreen") && !this._status.get("FullscreenChat-frame-chat-docking")) {
			setTimeout(() => {
				this.setIframe(!YoutubeState.isChatCollapsing());
				window.dispatchEvent(new Event("resize"));
			});
		}
	}

	setIframe(enable, docking=false) {
		if (enable) {
			// 浮動チャット
			this.setChatPosition(
				this._status.get("FullscreenChat-frame-top"),
				this._status.get("FullscreenChat-frame-left"),
				this._status.get("FullscreenChat-frame-width"),
				this._status.get("FullscreenChat-frame-height")
			);
		} else {
			// 通常チャット
			this.unsetChatPosition(docking);
		}
	}

	setChatPosition(top, left, width, height, save=false) {
		if (top < 0) top = 0;
		if (height < 400) height = 400;
		if (window.innerHeight < top + height) {
			top = window.innerHeight - height;
			if (top < 0) {
				top = 0;
				height = window.innerHeight;
				if (height < 400) {
					height = 400;
				}
			}
		}
		if (left < 0) left = 0;
		if (width < 300) width = 300;
		if (window.innerWidth < width + left) {
			left = window.innerWidth - width;
			if (left < 0) {
				left = 0;
				width = window.innerWidth;
				if (width < 300) {
					width = 300;
				}
			}
		}

		const chatFrame = document.querySelector("ytd-live-chat-frame#chat");
		chatFrame.style.position = "absolute";
		chatFrame.style.top = top + "px";
		chatFrame.style.left = left + "px";
		chatFrame.style.width = width + "px";
		chatFrame.style.height = height + "px";
		chatFrame.style.minHeight = "400px";
		chatFrame.style.margin = "0";
		chatFrame.style.zIndex = "60";
		document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-chat-docking");

		if (save) {
			this._status.set("FullscreenChat-frame-top", top);
			this._status.set("FullscreenChat-frame-left", left);
			this._status.set("FullscreenChat-frame-width", width);
			this._status.set("FullscreenChat-frame-height", height);
			this._status.set("FullscreenChat-frame-chat-docking", false);
		}
	}

	unsetChatPosition(docking, save=false) {
		const chatFrame = document.querySelector("ytd-live-chat-frame#chat");
		chatFrame.style.position = "";
		chatFrame.style.top = "";
		chatFrame.style.left = "";
		chatFrame.style.width = "";
		chatFrame.style.height = "";
		chatFrame.style.minHeight = "";
		chatFrame.style.margin = "";
		chatFrame.style.zIndex = "";
		if (docking) {
			document.querySelector("ytd-app").setAttribute("ytcex-fullscreen-chat-chat-docking", "");
		}

		if (save) {
			this._status.set("FullscreenChat-frame-chat-docking", true);
		}
	}

	calcChatPosition(grabId, baseTop, baseLeft, baseWidth, baseHeight, moveX, moveY, adjust=false) {
		let calced = {
			top: baseTop,
			left: baseLeft,
			width: baseWidth,
			height: baseHeight
		};
		if (grabId == "0") {
			if (baseTop + moveY < 0) {
				calced.top = 0;
			} else if (window.innerHeight - baseTop - baseHeight - moveY < 0) {
				calced.top = window.innerHeight - baseHeight;
			} else {
				const top = baseTop + moveY;
				if (adjust) {
					calced.top = Math.round(top / 20) * 20;
				} else {
					calced.top = top;
				}
			}
			if (baseLeft + moveX < 0) {
				calced.left = 0;
			} else if (window.innerWidth - baseLeft - baseWidth - moveX < 0) {
				calced.left = window.innerWidth - baseWidth;
			} else {
				const left = baseLeft + moveX;
				if (adjust) {
					calced.left = Math.round(left / 20) * 20;
				} else {
					calced.left = left;
				}
			}
		}
		if ("123".indexOf(grabId) >= 0) {
			if (baseTop + moveY < 0) {
				calced.top = 0;
				calced.height = baseTop + baseHeight;
			} else if (baseHeight - moveY < 400) {
				calced.top = baseTop + baseHeight - 400;
				calced.height = 400;
			} else {
				const height = baseHeight - moveY;
				const top = baseTop + moveY;
				if (adjust) {
					calced.height = Math.round(height / 20) * 20;
					calced.top = top + height - calced.height
				} else {
					calced.height = height;
					calced.top = top;
				}
			}
		}
		if ("789".indexOf(grabId) >= 0) {
			if (baseHeight + moveY < 400) {
				calced.height = 400;
			} else if (window.innerHeight - baseTop - baseHeight - moveY < 0) {
				calced.height = window.innerHeight - baseTop;
			} else {
				const height = baseHeight + moveY;
				if (adjust) {
					calced.height = Math.round(height / 20) * 20;
				} else {
					calced.height = height;
				}
			}
		}
		if ("147".indexOf(grabId) >= 0) {
			if (baseLeft + moveX < 0) {
				calced.left = 0;
				calced.width = baseLeft + baseWidth;
			} else if (baseWidth - moveX < 300) {
				calced.left = baseLeft + baseWidth - 300;
				calced.width = 300;
			} else {
				const width = baseWidth - moveX;
				const left = baseLeft + moveX;
				if (adjust) {
					calced.width = Math.round(width / 20) * 20;
					calced.left = left + width - calced.width;
				} else {
					calced.width = width;
					calced.left = left;
				}
			}
		}
		if ("369".indexOf(grabId) >= 0) {
			if (baseWidth + moveX < 300) {
				calced.width = 300;
			} else if (window.innerWidth - baseLeft - baseWidth - moveX < 0) {
				calced.width = window.innerWidth - baseLeft;
			} else {
				const width = baseWidth + moveX;
				if (adjust) {
					calced.width = Math.round(width / 20) * 20;
				} else {
					calced.width = width;
				}
			}
		}
		return calced;
	}

	grabMainEvent(event) {
		const rect = document.querySelector("ytd-live-chat-frame#chat").getBoundingClientRect();
		this.grab = {
			id: event.target.closest("[data-btn-id]").getAttribute("data-btn-id"),
			x: rect.x + event.pageX,
			y: rect.y + event.pageY
		}
		this.base = {
			top: rect.top,
			left: rect.left,
			width: this._status.get("FullscreenChat-frame-width"),
			height: this._status.get("FullscreenChat-frame-height")
		}
		this.adjust = false;
		if (this._status.get("FullscreenChat-frame-chat-docking")) {
			setTimeout(() => this.setChatPosition(this.base.top, this.base.left, this.base.width, this.base.height));	// setTimeoutがないとなぜかstyleが書き込まれない
			this._event.dispatch("FullscreenChat-chat-docking", false);
			window.dispatchEvent(new Event("resize"));
		}
		if (this.grab.id == "0") {
			document.querySelector("ytd-app").setAttribute("ytcex-fullscreen-chat-chat-docking-guide", "");
		}
		this._event.listen("FullscreenChat-iframe-move", this._bind.moveMainEvent);
	}

	moveMainEvent(event) {
		const rect = document.querySelector("ytd-live-chat-frame#chat").getBoundingClientRect();
		const moveX = rect.x + event.pageX - this.grab.x;
		const moveY = rect.y + event.pageY - this.grab.y;
		const next = this.calcChatPosition(this.grab.id, this.base.top, this.base.left, this.base.width, this.base.height, moveX, moveY, this.adjust);
		this.setChatPosition(next.top, next.left, next.width, next.height);
		if (this.grab.id == "0") {
			if (window.innerWidth - (rect.x + event.pageX) <= 36) {
				document.querySelector("ytd-app").setAttribute("ytcex-fullscreen-chat-chat-docking-guide-extend", "");
			} else {
				document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-chat-docking-guide-extend");
			}
		}
	}

	ungrabMainEvent(event) {
		const rect = document.querySelector("ytd-live-chat-frame#chat").getBoundingClientRect();
		document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-chat-docking-guide");
		document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-chat-docking-guide-extend");
		if (this.grab.id == "0" && window.innerWidth - (rect.x + event.pageX) <= 36) {
			this._event.dispatch("FullscreenChat-chat-docking", true);
			this.unsetChatPosition(true, true);
			window.dispatchEvent(new Event("resize"));
		}else{
			const moveX = rect.x + event.pageX - this.grab.x;
			const moveY = rect.y + event.pageY - this.grab.y;
			const next = this.calcChatPosition(this.grab.id, this.base.top, this.base.left, this.base.width, this.base.height, moveX, moveY, this.adjust);
			this.setChatPosition(next.top, next.left, next.width, next.height, true);
		}
		this._event.unlisten("FullscreenChat-iframe-move", this._bind.moveMainEvent);
	}

	adjustMainEvent(adjust) {
		this.adjust = adjust;
	}

	/* iframe */
	fullscreenIframeEvent() {
		if (this._status.get("yt-fullscreen")) {
			document.querySelector("yt-live-chat-app").setAttribute("ytcex-fullscreen-chat-fullscreen", "");
			if (this._status.get("FullscreenChat-frame-chat-docking")) {
				document.querySelector("yt-live-chat-app").setAttribute("ytcex-fullscreen-chat-chat-docking", "");
			}
		}else{
			document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat-fullscreen");
			document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat-chat-docking");
		}
	}

	grabIframeEvent(e) {
		if(this.moving !== false){
			return;
		}

		if(e.type == "mousedown"){
			this.moving = true;
			this._event.dispatch("FullscreenChat-iframe-grab", {
				target: e.target,
				pageX: e.pageX,
				pageY: e.pageY
			});
			document.addEventListener("mousemove", this._bind.moveIframeEvent);
			document.addEventListener("mouseup", this._bind.ungrabIframeEvent, {once: true});
			document.addEventListener("keydown", this._bind.adjustIframeEvent);
			document.addEventListener("keyup", this._bind.adjustIframeEvent);
		}else if(e.type == "touchstart"){
			let touch = e.changedTouches[0];
			this.moving = touch.identifier;
			e.preventDefault();
			this._event.dispatch("FullscreenChat-iframe-grab", {
				target: e.target,
				pageX: touch.pageX,
				pageY: touch.pageY
			});
			document.addEventListener("touchmove", this._bind.moveIframeEvent);
			document.addEventListener("touchend", this._bind.ungrabIframeEvent);
		}
	}

	moveIframeEvent(e) {
		if(e.type == "mousemove"){
			this._event.dispatch("FullscreenChat-iframe-move", {
				pageX: e.pageX,
				pageY: e.pageY
			});
		}else if(e.type == "touchmove"){
			let touch = false;
			for(let i = 0; i < e.changedTouches.length; i++){
				if(e.changedTouches[i].identifier === this.moving){
					touch = e.changedTouches[i];
					break;
				}
			}
			if(!touch){
				return;
			}

			this._event.dispatch("FullscreenChat-iframe-move", {
				pageX: touch.pageX,
				pageY: touch.pageY
			});
		}
	}

	ungrabIframeEvent(e) {
		if(e.type == "mouseup"){
			document.removeEventListener("mousemove", this._bind.moveIframeEvent);
			document.removeEventListener("keydown", this._bind.adjustIframeEvent);
			document.removeEventListener("keyup", this._bind.adjustIframeEvent);
			this._event.dispatch("FullscreenChat-iframe-ungrab", {
				pageX: e.pageX,
				pageY: e.pageY
			});
			this.moving = false;
		}else if(e.type == "touchend"){
			let touch = false;
			for(let i = 0; i < e.changedTouches.length; i++){
				if(e.changedTouches[i].identifier === this.moving){
					touch = e.changedTouches[i];
					break;
				}
			}
			if(!touch){
				return;
			}

			document.removeEventListener("touchmove", this._bind.moveIframeEvent);
			document.removeEventListener("touchend", this._bind.ungrabIframeEvent);
			this._event.dispatch("FullscreenChat-iframe-ungrab", {
				pageX: touch.pageX,
				pageY: touch.pageY
			});
			this.moving = false;
		}
	}

	adjustIframeEvent(e) {
		if(e.keyCode == 16){
			if(e.type == "keydown"){
				this._event.dispatch("FullscreenChat-iframe-adjust-fixed-length", true);
			}else if(e.type == "keyup"){
				this._event.dispatch("FullscreenChat-iframe-adjust-fixed-length", false);
			}
		}
	}

	setIframeChatDocking(docking) {
		if (docking) {
			document.querySelector("yt-live-chat-app").setAttribute("ytcex-fullscreen-chat-chat-docking","");
		} else {
			document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat-chat-docking");
		}
	}
}
