import SocketIO from "@/utils/socket/index";

const state = {
	socket: null // socket实例
}

const mutations = {
    SET_SOCKET: (state, socket) => {
        state.socket = socket;
    },
		INIT_ROOM: (state, uid) => {
			const { io } = state.socket;
			const socketId = io.id;
			const data = { uid, socketId };
			io.emit("initUserRoom", data);
		}
}

const actions = {
	connect({ commit }) {
		return new Promise((resolve, reject) => {
			let _socket;
			function _conn() {
				return new Promise((resolve, reject) => {
					resolve("http://127.0.0.1:3000/");
				})
			}
			// 伪代码，后续换成查询服务地址
			_conn().then(connection => {
				_socket = new SocketIO({
					connection,
					debug: true
				});
				commit("SET_SOCKET", _socket);
				resolve();
			})
		})
	},
	/**
	 * 初始化一些事件监听
	 */
	initEvent({ commit, dispatch, state }, initData) {
		const { socket } = state;
		const { uid, component } = initData;
		socket.subscribe("connect", function() {
			commit("INIT_ROOM", uid);
		}, component);
		that.socket.subscribe("receiveUserMsg", function(data) {
			const { Uid, Msg, Timestamp } = data;
			dispatch("previewMsg/receiveMsg", { Uid, Msg, Timestamp });
		}, component);
	},
	/**
	 * 发送消息
	 */
	sendMsg({ state }, data) {
		const { io } = state.socket;
		io.emit("sendMsgToUser", data);
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}