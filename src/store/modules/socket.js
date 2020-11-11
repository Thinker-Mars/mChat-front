import SocketIO from "@/utils/socket/index";

const state = {
	socket: null // socket实例
}

const mutations = {
    SET_SOCKET: (state, socket) => {
        state.socket = socket;
    }
}

const actions = {
	connect({commit}) {
		return new Promise((resolve, reject) => {
			let _socket;
			function _conn() {
				return new Promise((resolve, reject) => {
					resolve("http://localhost:3000/");
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
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}