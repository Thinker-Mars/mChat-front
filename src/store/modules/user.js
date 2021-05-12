const state = {
	/**
	 * 用户基本信息，包含如下内容：
	 * Uid：用户唯一ID
	 * Gender：性别
	 * NickName：昵称
	 * BirthDay：生日，如02.14
	 * Avatar：头像URL
	 * Home：地址
	 * Motto：格言
	 */
	userInfo: {}
};

const mutations = {
	SET_USERINFO: (state, userinfo) => {
		const { Uid, NickName, Motto, Home, Gender, BirthDay, Avatar } = userinfo;
		state.userInfo = { Uid, NickName, Motto, Home, Gender, BirthDay, Avatar };
	}
};

const actions = {
	/**
	 * 保存当前登录用户的信息
	 */
	setUserInfo({ commit }, userinfo) {
		commit('SET_USERINFO', userinfo);
	}
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
