import Core from "../base/core.js";
import YoutubeState from "./youtube_state.js";

export default class YoutubeEvent extends Core {
	constructor(event, status, debug) {
		super();
		super.register(event, status, debug);
		this._event.listen("initialized", this._bind.init);

		if (YoutubeState.isAppFrame()) {
			document.querySelector("ytd-app").addEventListener("yt-navigate-finish", this._bind.onYtNavigateFinish);
			document.querySelector("ytd-app").addEventListener("yt-action", this._bind.onYtAction);
		}
	}

	init() {
		this._status.addNew("yt-fullscreen", false, "none");
	}

	onYtNavigateFinish(e) {
		this._event.dispatch("yt-load", e);
	}

	onYtAction(e) {
		switch (e.detail?.actionName) {
			case "yt-fullscreen-change-action":
				this._status.set("yt-fullscreen", e.detail.args[0]);
				this._event.dispatch("yt-fullscreen", e);
				break;
			case "yt-set-live-chat-collapsed":
				this._event.dispatch("yt-live-chat-collapsed", e);
				break;
		}
	}
}