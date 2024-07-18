export default class Base {
	register(event, status, debug) {
		this._event = event;
		this._status = status;
		this._debug = debug;
		this._bind = new Proxy({}, {
			get: (target, prop) => {
				if (prop in target) {
					return target[prop];
				}
				return target[prop] = this[prop].bind(this);
			}
		});
	}
}