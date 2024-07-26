import Connection from "./connection.js";
import YoutubeEvent from "../youtube/youtube_event.js";

export default class EventManager extends Connection {
	register(event, status, debug) {
		super.register(event, status, debug);
		this._listenMessage(this._bind._onMessage);
		this._listeners = {};
		this._yevent = new YoutubeEvent(event, status, debug);
	}

	listen(event, callback) {
		if (!this._listeners[event]) {
			this._listeners[event] = [];
		}
		this._listeners[event].push(callback);
	}

	unlisten(event, callback) {
		if (!this._listeners[event]) {
			return;
		}
		const index = this._listeners[event].indexOf(callback);
		if (index === -1) {
			return;
		}
		this._listeners[event].splice(index, 1);
	}

	dispatch(event, data, all=true) {
		if (all) {
			this._sendMessage({event, data});
		} else {
			this._bind._onMessage(this._getEvent({event, data}));
		}
	}

	_onMessage(event) {
		if (!this._listeners[event.detail?.event]) {
			return;
		}
		this._listeners[event.detail.event].forEach((callback) => {
			try {
				callback(event.detail?.data);
			} catch (error) {
				this._debug.error(error);
			}
		});
	}
}