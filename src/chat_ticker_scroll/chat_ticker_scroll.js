import Ext from "../base/ext.js";
import YoutubeState from "../youtube/youtube_state.js";

export default class ChatTickerScroll extends Ext {
	constructor(event, status, debug) {
		super(event, status, debug);
		this._event.listen("initialized", this._bind.init);
		this._event.listen("requestOptions", this._bind.registerOptions);
	}

	init() {
		this._status.addNew("ChatTickerScroll", false, "auto");
		this._status.addNew("ChatTickerScroll-opt-button-hide", true, "auto");
		this._event.listen("statusChanged", this._bind.onStatusChanged);

		this.buttons = {
			true: document.querySelector("#ticker #left-arrow-container yt-icon"),
			false: document.querySelector("#ticker #right-arrow-container yt-icon")
		};
		this.timeoutHandlers = {
			true: null,
			false: null
		};

		if (this._status.get("ChatTickerScroll") && YoutubeState.isChatFrame()) {
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
				name: "ChatTickerScroll",
				caption: "ChatTickerScroll_Description",
				childrenTrue: [
					{
						type: "toggle",
						name: "ChatTickerScroll-opt-button-hide",
						caption: "ChatTickerScroll_ButtonHide"
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

		if ("ChatTickerScroll" in changes) {
			if (changes["ChatTickerScroll"]) {
				this.enable();
			} else {
				this.disable();
			}
		} else if(this._status.get("ChatTickerScroll")) {
			if ("ChatTickerScroll-opt-button-hide" in changes) {
				if (changes["ChatTickerScroll-opt-button-hide"]) {
					document.querySelector("yt-live-chat-app").setAttribute("ytcex-chat-ticker-scroll-button-hide", "");
				} else {
					document.querySelector("yt-live-chat-app").removeAttribute("ytcex-chat-ticker-scroll-button-hide");
				}
			}
		}
	}

	enable() {
		document.querySelector("yt-live-chat-app").setAttribute("ytcex-chat-ticker-scroll", "");
		if (this._status.get("ChatTickerScroll-opt-button-hide")) {
			document.querySelector("yt-live-chat-app").setAttribute("ytcex-chat-ticker-scroll-button-hide", "");
		}
		this.ticker = document.querySelector("#ticker yt-live-chat-ticker-renderer");
		this.ticker.addEventListener("wheel", this._bind.onTickerScrolled);
	}

	disable() {
		document.querySelector("yt-live-chat-app").removeAttribute("ytcex-chat-ticker-scroll");
		document.querySelector("yt-live-chat-app").removeAttribute("ytcex-chat-ticker-scroll-button-hide");
		this.ticker.removeEventListener("wheel", this._bind.onTickerScrolled);
	}

	onTickerScrolled(e) {
		const side = e.wheelDelta >= 0;
		if (this.timeoutHandlers[side]) {
			clearTimeout(this.timeoutHandlers[side]);
		} else {
			if (this.timeoutHandlers[!side]) {
				clearTimeout(this.timeoutHandlers[!side]);
				this.timeoutHandlers[!side] = null;
				this.buttons[!side].dispatchEvent(new Event("up"));
			}
			this.buttons[side].dispatchEvent(new Event("down"));
		}
		this.timeoutHandlers[side] = setTimeout(() => {
			this.timeoutHandlers[side] = null;
			this.buttons[side].dispatchEvent(new Event("up"));
		}, 500);
	}
}