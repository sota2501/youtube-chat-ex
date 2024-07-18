import Core from "../base/core.js";

export default class StatusManager extends Core {
	register(event, status, debug) {
		super.register(event, status, debug);
		Promise.all([
			chrome.storage.sync.get(),
			chrome.storage.local.get()
		]).then(values => {
			this._sync = values[0];
			this._local = values[1];
			this.addNew("flag-use-local", false, "local");
			this._event.dispatch("statusInitialized", null, false);
		});
		this._instance = {};
		this._prop = {};
		const statusInitCallback = () => {
			this._event.unlisten("statusData", statusDataCallback);
			this._event.dispatch("statusData", {instance: this._instance, prop: this._prop});
		};
		const statusDataCallback = data => {
			this._instance = data.instance;
			this._prop = data.prop;
			this._event.unlisten("statusInit", statusInitCallback);
			this._event.unlisten("statusData", statusDataCallback);
		};
		this._event.listen("statusData", statusDataCallback);
		this._event.dispatch("statusInit");
		this._event.listen("statusInit", statusInitCallback);
		chrome.storage.onChanged.addListener(this._bind._onStorageChanged);
		this._event.listen("statusPropChanged", this._bind._onStatusPropChanged);
		this._event.listen("statusChanged", this._bind._onStatusChanged);
	}

	_onStorageChanged(changes, area) {
		let data;
		if (area == "sync") {
			data = this._sync;
		} else if (area == "local") {
			data = this._local;
		}

		for (let key in changes) {
			if (changes[key].newValue === undefined) {
				delete data[key];
			} else {
				data[key] = changes[key].newValue;
			}
		}
	}

	_onStatusPropChanged(changes) {
		for (let key in changes) {
			if (key in this._prop) {
				continue;
			}

			this._prop[key] = {default: changes[key].default, save: changes[key].save};
		}
	}

	_onStatusChanged(changes) {
		for (let key in changes) {
			if (!(key in this._prop)) {
				continue;
			}

			if (changes[key] === undefined) {
				delete this._instance[key];
			} else {
				this._instance[key] = changes[key];
			}
		}
	}

	addNew(key, defaultValue, save) {
		if (key in this._prop) {
			return;
		}

		this._event.dispatch("statusPropChanged", {[key]: {default: defaultValue, save: save}});

		if (save == "auto") {
			if (this.get("flag-use-local")) {
				save = "local";
			} else {
				save = "sync";
			}
		}

		if (save == "sync") {
			this.set(key, this._sync[key] ?? defaultValue, false);
		} else if (save == "local") {
			this.set(key, this._local[key] ?? defaultValue, false);
		} else {
			this.set(key, defaultValue, false);
		}
	}

	get(key) {
		if (!(key in this._prop)) {
			console.error("status get(error): ", key);
			return null;
		}

		return this._instance[key];
	}

	set(key, value, storage=true) {
		if (!(key in this._prop)) {
			console.error("status set(error): ", key, value);
			return;
		}

		if (storage) {
			let save = this._prop[key].save;
			if (save == "auto") {
				if (this.get("flag-use-local")) {
					save = "local";
				} else {
					save = "sync";
				}
			}

			if (save == "sync") {
				chrome.storage.sync.set({[key]: value});
			} else if (save == "local") {
				chrome.storage.local.set({[key]: value});
			}
		}

		const changes = {[key]: value};
		this._event.dispatch("statusChanged", changes);
	}

	remove(key, storage=true) {
		if (!(key in this._prop)) {
			console.error("status remove(error): ", key, value);
			return;
		}

		if (storage) {
			let save = this._prop[key].save;
			if (save == "auto") {
				if (this.get("flag-use-local")) {
					save = "local";
				} else {
					save = "sync";
				}
			}

			if (this._prop[key].save == "sync") {
				chrome.storage.sync.remove(key);
			} else if (this._prop[key].save == "local") {
				chrome.storage.local.remove(key);
			}
		}

		const changes = {[key]: undefined};
		this._event.dispatch("statusChanged", changes);
	}
}