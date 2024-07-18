import Core from "../base/core.js";
import YoutubeState from "./youtube_state.js";

export default class YoutubeEvent extends Core {
	constructor(event, status, debug) {
		super();
		super.register(event, status, debug);

		if (YoutubeState.isAppFrame()) {
			document.querySelector("ytd-app").addEventListener("yt-navigate-finish", this._bind.onYtLoad);
			document.querySelector("ytd-app").addEventListener("yt-navigate-start", this._bind.onYtUnload);
			document.querySelector("ytd-app").addEventListener("yt-action", this._bind.onYtFullscreen);
		}
	}

	onYtLoad(e) {
		this._event.dispatch("yt-load", e);
	}

	onYtUnload(e) {
		this._event.dispatch("yt-unload", e);
	}

	onYtFullscreen(e) {
		if (e.detail?.actionName == "yt-fullscreen-change-action") {
			this._event.dispatch("yt-fullscreen", e);
		}
	}
}