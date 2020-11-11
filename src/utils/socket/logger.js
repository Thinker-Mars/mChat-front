/**
 * 记录socket日志
 */
export default new class SocketLogger {

	constructor() {
		this.debug = false;
		this.prefix = "mChat-Socket: ";
	}

	info(text) {
		if (this.debug) {
			window.console.info(`${this.prefix}%c${text}`, 'color: blue; font-weight: 600');
		}
	}

}