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
				// connection: 'http://47.92.82.34:9080',
        connection: 'http://127.0.0.1:4000',
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
    /** 收到聊天数据 */
    socket.subscribe('receiveUserMsg', function(data) {
      dispatch('previewMsg/receiveMsg', data);
    }, component);
    /** 收到好友申请的数据 */
    socket.subscribe('receiveFriendApplyMsg', function(data) {
      console.log(data, 'datatttt');
      dispatch('friend/receiveApply', data);
    }, component);
  },
  /**
	 * 发送聊天消息
	 */
  sendMsg({ state }, data) {
    const { io } = state.socket;
    io.emit('sendMsgToUser', data);
  },
  /**
   * 发送好友申请
   * @param {object} data
   */
  sendFriendApply({ state }, data) {
    const { io } = state.socket;
    io.emit('sendFriendApply', data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
