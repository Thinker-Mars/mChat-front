import io from 'socket.io-client';
import logger from "./logger";
import Emitter from "./emitter";
import Listener from "./listener";

export default class SocketIO {

	constructor({connection, options, debug}) {
		logger.debug = debug;
		this.io = this.connect(connection, options);
		this.emitter = new Emitter();
		this.listener = new Listener(this.io, this.emitter);
	}

	/**
	 * 建立socket连接
	 * @param {string} connection 地址
	 * @param {*} options 
	 */
	connect(connection, options) {
		logger.info("即将建立socket连接");
		return io(connection, options);
	}

	/**
	 * 对外暴露的 [监听事件] 接口
	 * @param {*} event 要监听的事件名
	 * @param {Function} callback 监听到事件后的处理函数
	 * @param {*} component 要监听事件的组件
	 */
	subscribe(event, callback, component) {
		this.emitter.addListener(event, callback, component);
	}

	/**
	 * 对外暴露的 [取消监听事件] 接口
	 * @param {*} event 要取消监听的事件名称
	 * @param {*} component 要取消监听事件的组件
	 */
	unsubscribe(event, component) {
		this.emitter.removeListener(event, component);
	}
}