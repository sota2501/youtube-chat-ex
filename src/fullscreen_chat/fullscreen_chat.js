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
		this._status.addNew("FullscreenChat-opt-use-chat-docking", false, "auto");
		this._status.addNew("FullscreenChat-frame-chat-docking", false, "local");
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
						type: "toggle",
						name: "FullscreenChat-opt-use-chat-docking",
						caption: "FullscreenChat_UseChatDocking",
						childrenTrue: [
							{
								type: "text",
								caption: "FullscreenChat_ChatDockingDescription"
							}
						]
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
			if (YoutubeState.isAppFrame()) {
				if ("FullscreenChat-opt-use-chat-docking" in changes) {
					if (this._status.get("FullscreenChat-opt-use-chat-docking")) {
						if (YoutubeState.isFullscreen() && this._status.get("FullscreenChat-frame-chat-docking")) {
							this.setIframe(true);
						}
					} else {
						this.setIframe(false);
					}
				}
			} else if (YoutubeState.isIframeChatFrame()) {
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
				if ("FullscreenChat-opt-use-chat-docking" in changes) {
					if (changes["FullscreenChat-opt-use-chat-docking"]) {
						if (YoutubeState.isFullscreen() && this._status.get("FullscreenChat-frame-chat-docking")) {
							document.querySelector("yt-live-chat-app").setAttribute("ytcex-fullscreen-chat-chat-docking", "");
						}
					} else {
						document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat-chat-docking");
					}
				}
			}
		}
	}

	enable() {
		if(YoutubeState.isAppFrame()){
			document.querySelector("ytd-app").setAttribute("ytcex-fullscreen-chat", "");
			this._event.listen("yt-load", this._bind.resetChatDocking);

			this._event.listen("FullscreenChat-iframe-set", this._bind.setIframe);
			this._event.listen("FullscreenChat-iframe-grab", this._bind.grabMainEvent);
			this._event.listen("FullscreenChat-iframe-ungrab", this._bind.ungrabMainEvent);
			this._event.listen("FullscreenChat-iframe-adjust-fixed-length", this._bind.adjustMainEvent);
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
			const chatTypeBtn = document.querySelector("#chat-messages > yt-live-chat-header-renderer > #primary-content");
			chatTypeBtn.insertAdjacentHTML("afterend", `
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
				const ytIcon = buttonRenderer.querySelector("yt-icon");
				ytIcon.insertAdjacentHTML("beforeend", `
					<svg viewBox="0 0 24 24" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
						<style>
							yt-icon-button.yt-live-chat-header-renderer yt-icon.yt-live-chat-header-renderer {
								fill: var(--yt-spec-icon-inactive)
							}
							yt-icon-button.yt-live-chat-header-renderer:hover yt-icon.yt-live-chat-header-renderer {
								fill: var(--yt-spec-icon-active-other)
							}
						</style>
						<g class="style-scope yt-icon">
							<path d="M12.5,12.5v7.086l2-2l.707,.707L12.5,21h-1l-2.707-2.707l.707-.707l2,2V12.5h-7.086l2,2l-.707,.707L3,12.5v-1l2.707-2.707l.707,.707l-2,2H11.5v-7.086l-2,2l-.707-.707L11.5,3h1l2.707,2.707l-.707,.707l-2-2V11.5h7.086l-2-2l.707-.707L21,11.5v1l-2.707,2.707l-.707-.707l2-2H12.5Z"></path>
						</g>
					</svg>
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
			this._event.listen("FullscreenChat-chat-docking", this._bind.chatDocking);
			this.fullscreenIframeEvent();
		}
	}

	disable() {
		if(YoutubeState.isAppFrame()){
			this._event.unlisten("FullscreenChat-iframe-set", this._bind.setIframe);
			this._event.unlisten("FullscreenChat-iframe-grab", this._bind.grabMainEvent);
			this._event.unlisten("FullscreenChat-iframe-ungrab", this._bind.ungrabMainEvent);
			this._event.unlisten("FullscreenChat-iframe-move", this._bind.moveMainEvent);
			this._event.unlisten("yt-load", this._bind.resetChatDocking);
			this.setIframe(null);
			document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat");
			document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-fullscreen");
			document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-chat-docking");
		}else if(YoutubeState.isIframeChatFrame()){
			document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat");
			document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat-fullscreen");
			document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat-text-outline");
			document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat-chat-docking");
			document.documentElement.style.removeProperty("--ytcex-fullscreen-chat-font-size");
			document.documentElement.style.removeProperty("--ytcex-fullscreen-chat-background-blur");
			document.documentElement.style.removeProperty("--ytcex-fullscreen-chat-opacity-def");
			document.documentElement.style.removeProperty("--ytcex-fullscreen-chat-opacity-hover");
			document.documentElement.style.removeProperty("--ytcex-fullscreen-chat-card-opacity-def");
			document.documentElement.style.removeProperty("--ytcex-fullscreen-chat-card-opacity-hover");
			this.moveBtn.remove();
			this.resizeBtn.remove();
			this._event.unlisten("yt-fullscreen", this._bind.fullscreenIframeEvent);
			this._event.unlisten("FullscreenChat-chat-docking", this._bind.chatDocking);
			document.removeEventListener("mousemove", this._bind.moveIframeEvent);
			document.removeEventListener("touchmove", this._bind.moveIframeEvent);
			document.removeEventListener("mouseup", this._bind.ungrabIframeEvent);
			document.removeEventListener("touchend", this._bind.ungrabIframeEvent);
			document.removeEventListener("keydown", this._bind.adjustIframeEvent);
			document.removeEventListener("keyup", this._bind.adjustIframeEvent);
		}
		const dom = document.querySelectorAll("[data-ytcex=\"FullscreenChat\"]");
		dom.forEach(e=>e.remove());
	}

	calcChatPosition(grabId, baseTop, baseLeft, baseWidth, baseHeight, moveX, moveY, adjust=false) {
		let calced = {};
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
			calced.width = baseWidth;
			calced.height = baseHeight;
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
			calced.top = baseTop;
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
		if ("28".indexOf(grabId) >= 0) {
			calced.left = baseLeft;
			calced.width = baseWidth;
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
			calced.left = baseLeft;
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
		if ("46".indexOf(grabId) >= 0) {
			calced.top = baseTop;
			calced.height = baseHeight;
		}
		return calced;
	}

	setChatPosition(top, left, width, height, save=false) {
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

		this.chatFrame.style.top = top + "px";
		this.chatFrame.style.left = left + "px";
		this.chatFrame.style.width = width + "px";
		this.chatFrame.style.height = height + "px";

		if (save) {
			this._status.set("FullscreenChat-frame-top", top);
			this._status.set("FullscreenChat-frame-left", left);
			this._status.set("FullscreenChat-frame-width", width);
			this._status.set("FullscreenChat-frame-height", height);
			this._status.set("FullscreenChat-frame-chat-docking", false);
		}
	}

	setChatDocking() {
		document.querySelector("ytd-app").setAttribute("ytcex-fullscreen-chat-chat-docking", "");
		this.chatFrame.style.minHeight = "";
		this.chatFrame.style.top = "0";
		this.chatFrame.style.left = "";
		this.chatFrame.style.right = "0";
		this.chatFrame.style.width = "400px";
		this.chatFrame.style.height = "100vh";

		this._status.set("FullscreenChat-frame-chat-docking", true);
	}

	setChatUndocking() {
		document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-chat-docking");
		this.chatFrame.style.minHeight = "400px";
		this.chatFrame.style.right = "";
	}

	resizeMainEvent() {
		if (this._status.get("FullscreenChat-opt-use-chat-docking") && this._status.get("FullscreenChat-frame-chat-docking")) {
			return;
		}

		let top = this._status.get("FullscreenChat-frame-top");
		let left = this._status.get("FullscreenChat-frame-left");
		let width = this._status.get("FullscreenChat-frame-width");
		let height = this._status.get("FullscreenChat-frame-height");
		this.setChatPosition(top, left, width, height);
	}

	grabMainEvent(event) {
		this.grab = {
			id: event.target.closest("[data-btn-id]").getAttribute("data-btn-id"),
			x: this.chatFrame.offsetLeft + event.pageX,
			y: this.chatFrame.offsetTop + event.pageY
		}
		this.base = {
			top: this._status.get("FullscreenChat-frame-top"),
			left: this._status.get("FullscreenChat-frame-left"),
			width: this._status.get("FullscreenChat-frame-width"),
			height: this._status.get("FullscreenChat-frame-height")
		}
		this.adjust = false;
		if (this._status.get("FullscreenChat-opt-use-chat-docking") && this._status.get("FullscreenChat-frame-chat-docking")) {
			this.base.top = 0;
			this.base.left = window.innerWidth - this.base.width;
			this.setChatUndocking();
			this.setChatPosition(this.base.top, this.base.left, this.base.width, this.base.height);
			this._event.dispatch("FullscreenChat-chat-docking", false);
		}
		this._event.listen("FullscreenChat-iframe-move", this._bind.moveMainEvent);
	}

	moveMainEvent(event) {
		const moveX = this.chatFrame.offsetLeft + event.pageX - this.grab.x;
		const moveY = this.chatFrame.offsetTop + event.pageY - this.grab.y;
		const next = this.calcChatPosition(this.grab.id, this.base.top, this.base.left, this.base.width, this.base.height, moveX, moveY, this.adjust);
		this.setChatPosition(next.top, next.left, next.width, next.height);
	}

	ungrabMainEvent(event) {
		if (this._status.get("FullscreenChat-opt-use-chat-docking") && this.grab.id == "0" && event.pageX - (this.grab.x - this.base.left) > 30) {
			this._event.dispatch("FullscreenChat-chat-docking", true);
			this.setChatDocking();
		}else{
			const moveX = this.chatFrame.offsetLeft + event.pageX - this.grab.x;
			const moveY = this.chatFrame.offsetTop + event.pageY - this.grab.y;
			const next = this.calcChatPosition(this.grab.id, this.base.top, this.base.left, this.base.width, this.base.height, moveX, moveY, this.adjust);
			this.setChatPosition(next.top, next.left, next.width, next.height, true);
		}
		this._event.unlisten("FullscreenChat-iframe-move", this._bind.moveMainEvent);
	}

	adjustMainEvent(adjust) {
		this.adjust = adjust;
	}

	fullscreenIframeEvent() {
		if (YoutubeState.isFullscreen()) {
			document.querySelector("yt-live-chat-app").setAttribute("ytcex-fullscreen-chat-fullscreen", "");
			if (this._status.get("FullscreenChat-opt-use-chat-docking") && this._status.get("FullscreenChat-frame-chat-docking")) {
				document.querySelector("yt-live-chat-app").setAttribute("ytcex-fullscreen-chat-chat-docking", "");
				this._event.dispatch("FullscreenChat-iframe-set", true);
			} else {
				this._event.dispatch("FullscreenChat-iframe-set", false);
			}
		}else{
			document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat-fullscreen");
			document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat-chat-docking");
			this._event.dispatch("FullscreenChat-iframe-set", null);
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

	adjustIframeEvent = (e)=>{
		if(e.keyCode == 16){
			if(e.type == "keydown"){
				this._event.dispatch("FullscreenChat-iframe-adjust-fixed-length", true);
			}else if(e.type == "keyup"){
				this._event.dispatch("FullscreenChat-iframe-adjust-fixed-length", false);
			}
		}
	}

	setIframe(frame) {
		this.chatFrame = document.querySelector("ytd-live-chat-frame#chat");
		if(frame != null){
			if(frame){
				document.querySelector("ytd-app").setAttribute("ytcex-fullscreen-chat-chat-docking", "");
				this.chatFrame.style.minHeight = "";
				this.chatFrame.style.top = "0";
				this.chatFrame.style.left = "";
				this.chatFrame.style.right = "0";
				this.chatFrame.style.width = "400px"; // this._status.get("FullscreenChat-frame-width-docking") + "px";
				this.chatFrame.style.height = "100vh";
			}else{
				document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-chat-docking");
				this.chatFrame.style.minHeight = "400px";
				this.chatFrame.style.top = this._status.get("FullscreenChat-frame-top") + "px";
				this.chatFrame.style.left = this._status.get("FullscreenChat-frame-left") + "px";
				this.chatFrame.style.right = "";
				this.chatFrame.style.width = this._status.get("FullscreenChat-frame-width") + "px";
				this.chatFrame.style.height = this._status.get("FullscreenChat-frame-height") + "px";
			}
			window.addEventListener("resize", this._bind.resizeMainEvent);
		}else{
			document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-chat-docking");
			this.chatFrame.style.minHeight = "";
			this.chatFrame.style.top = "";
			this.chatFrame.style.left = "";
			this.chatFrame.style.right = "";
			this.chatFrame.style.width = "";
			this.chatFrame.style.height = "";
			window.removeEventListener("resize", this._bind.resizeMainEvent);
		}
	}

	resetChatDocking() {
		document.querySelector("ytd-app").removeAttribute("ytcex-fullscreen-chat-chat-docking");
	}

	chatDocking(docking) {
		if (docking) {
			document.querySelector("yt-live-chat-app").setAttribute("ytcex-fullscreen-chat-chat-docking","");
		} else {
			document.querySelector("yt-live-chat-app").removeAttribute("ytcex-fullscreen-chat-chat-docking");
		}
	}
}