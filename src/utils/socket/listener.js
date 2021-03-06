export default class SocketListener {
	constructor(io, emitter) {
		this.io = io;
		this.emitter = emitter;
		this.staticEvents = [
			'connect',
			'disconnect',
			'error'
		];
		this.register();
	}

	/**
	 * Listening all socket.io events
	 */
	register() {
		this.io.onevent = (packet) => {
			let [event, ...args] = packet.data;

			if (args.length === 1) {
				args = args[0];
			}

			this.onEvent(event, args);
		};

		/**
		 * 当staticEvents中定义的事件被监听到，就触发它
		 */
		this.staticEvents.forEach(event => {
			this.io.on(event, args => {
				this.onEvent(event, args);
			});
		});
	}

	/**
	 * Broadcast all events to vuejs environment
	 * @param {*} event
	 * @param {*} args
	 */
	onEvent(event, args) {
		this.emitter.emit(event, args);
	};
}
