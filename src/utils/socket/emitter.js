import logger from "./logger";

export default class SocketEventEmitter {

	constructor() {
		this.listeners = new Map();
	}

	/**
	 * 添加 [组件] 对某个 [事件] 的监听
	 * @param {string} event 要监听的事件名称
	 * @param {Function} callback 监听到事件后的处理函数
	 * @param {*} component 要监听事件的组件
	 */
	addListener(event, callback, component) {
		if (typeof callback === "function") {
			
			if (!this.listeners.has(event)) {
				this.listeners.set(event, []);
			}

			this.listeners.get(event).push({
				callback,
				component
			});

			logger.info(`${component.$options.name}已订阅事件: ${event}`);

		} else {

			throw new Error("callback只支持函数.");

		}
	}

	/**
	 * 移除 [组件] 上对某个 [事件] 的监听
	 * @param {*} event 要取消监听的事件名称
	 * @param {*} component 要取消监听的组件
	 */
	removeListener(event, component) {

		if (this.listeners.has(event)) {
			// 分离出监听此事件的其他组件
			const listeners = this.listeners.get(event).filter(listner => (
				listner.component !== component
			));

			if (listeners.length > 0) {
				// 更新这个event的监听器（等于删除组件对这个event的监听）
				this.listeners.set(event, listeners);
			} else {
				// 没有其他组件监听这个事件，就直接map中移除这一项
				this.listeners.delete(event);
			}

			logger.info(`${component.$options.name}已取消订阅事件: ${event}`);
		}
	}

	/**
	 * 将到来的 [事件] [广播] 给订阅此事件的 [组件]
	 * @param {*} event 事件名称
	 * @param {*} args 
	 */
	emit(event, args) {

		if (this.listeners.has(event)) {

			logger.info(`事件被触发: ${event}`);

			this.listeners.get(event).forEach(listener => {
				listener.callback.call(listener.component, args);
			})
		}
	}

}