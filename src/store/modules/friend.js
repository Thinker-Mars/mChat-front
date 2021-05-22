const state = {
  checkfriendUid: undefined, // [朋友]页查看的朋友的uid
  friendList: [], // 朋友列表数据
	applyList: [] // 好友申请列表
};

const mutations = {
  /**
	 * 保存当前查看的朋友信息的uid
	 */
  SET_FRIEND_UID: (state, uid) => {
    state.checkfriendUid = uid;
  },
	/**
	 * 保存当前登录用户的好友信息
	 */
	SET_FRIEND_LIST: (state, friendList) => {
		state.friendList = friendList;
	}
};

const actions = {
  /**
	 * 记录当前查看的朋友信息的uid
	 */
  setFriendUID({ commit }, uid) {
    commit('SET_FRIEND_UID', uid);
  },
	/**
	 * 记录好友信息
	 * @param {Array} friendList 好友信息数组
	 */
	setFriendList({ commit }, friendList) {
		commit('SET_FRIEND_LIST', friendList);
	},
	/**
	 * 收到好友申请
	 * @param {object} data 好友申请数据
	 */
	receiveApply({ commit }, data) {
		console.log(data, '收到申请');
	}
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
