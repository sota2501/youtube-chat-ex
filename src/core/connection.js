import Core from "../base/core.js";

export default class Connection extends Core {
	register(event, status, debug) {
		super.register(event, status, debug);
		this.root = window.opener ? window.opener.top : window.top;
	}

	_listenMessage(callback) {
		this.root.addEventListener("ytcex-message", callback);
	}

	_getEvent(data) {
		return new CustomEvent("ytcex-message", {detail: data});
	}

	_sendMessage(data) {
		this.root.dispatchEvent(this._getEvent(data));
	}
}