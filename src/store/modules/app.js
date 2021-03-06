const state = {
	db: undefined
};

const mutations = {
	SET_DB: (state, db) => {
		state.db = db;
	}
};

const actions = {
	setDB({ commit }, db) {
		commit('SET_DB', db);
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};
