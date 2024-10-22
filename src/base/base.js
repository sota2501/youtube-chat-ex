/**
 * @typedef {import('../core/event_manager').default} EventManager
 * @typedef {import('../core/status_manager').default} StatusManager
 * @typedef {import('../core/debug').default} Debug
 */

export default class Base {
	register(event, status, debug) {
		/** @type EventManager */
		this._event = event;

		/** @type StatusManager */
		this._status = status;

		/** @type Debug */
		this._debug = debug;

		/** @type this */
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