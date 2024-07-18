import Base from './base.js';

export default class Ext extends Base {
	constructor(event, status, debug) {
		super();
		this.register(event, status, debug);
	}
}