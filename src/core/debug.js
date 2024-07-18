import Core from "../base/core.js";

export default class Debug extends Core {
	error(error) {
		setTimeout(() => {
			throw error;
		});
	}
}