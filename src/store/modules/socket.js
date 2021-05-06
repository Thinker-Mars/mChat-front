import SocketIO from '@/utils/socket/index';

const state = {
  socket: null // socket实例
};

const mutations = {
  /**
	 * 保存socket对象
	 */
  SET_SOCKET: (state, socket) => {
    state.socket = socket;
  },
  /**
	 * 初始化socket的room
	 */
  INIT_ROOM: (state, uid) => {
    const { io } = state.socket;
    const socketId = io.id;
    const data = { uid, socketId };
    io.emit('initUserRoom', data);
  }
};

const actions = {
  connectSystem({ commit }) {
    return new Promise((resolve, reject) => {
			const socket = new SocketIO({
				connection: 'http://47.92.82.34:9080',
				options: {
					path: '/onlineCenter/connect',
					extraHeaders: {
						apikey: 'onlinecenter'
					},
					transportOptions: {
						polling: {
							extraHeaders: {
								apikey: 'onlinecenter'
							}
						}
					}
				},
				debug: true
			});
			commit('SET_SOCKET', socket);
			resolve();
    });
  },
  /**
	 * 初始化一些事件监听
	 */
  initEvent({ commit, dispatch, state }, initData) {
    const { socket } = state;
    const { uid, component } = initData;
    socket.subscribe('connect', function() {
      commit('INIT_ROOM', uid);
    }, component);
    socket.subscribe('receiveUserMsg', function(data) {
      dispatch('previewMsg/receiveMsg', data);
    }, component);
  },
  /**
	 * 发送消息
	 */
  sendMsg({ state }, data) {
    const { io } = state.socket;
    io.emit('sendMsgToUser', data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
