const state = {
	uid: undefined // 用户在mChat的唯一标识
};

const mutations = {
	SET_UID: (state, uid) => {
		state.uid = uid;
	}
};

const actions = {
	setUID({ commit }, uid) {
		commit('SET_UID', uid);
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};
