const state = {
  checkfriendUid: undefined, // [朋友]页查看的朋友的uid
  friendList: [
    {
      Uid: 1000,
      NickName: '亚特兰蒂斯',
      NoteName: '',
      Gender: 1,
      Avatar: ''
    },
    {
      Uid: 1001,
      NickName: '草莓',
      NoteName: '',
      Gender: 2,
      Avatar: ''
    },
    {
      Uid: 1002,
      NickName: 'Lucky',
      NoteName: '',
      Gender: 2,
      Avatar: ''
    },
    {
      Uid: 1003,
      NickName: '大壮',
      NoteName: '',
      Gender: 1,
      Avatar: ''
    },
    {
      Uid: 1004,
      NickName: '小明',
      NoteName: '',
      Gender: 1,
      Avatar: ''
    },
    {
      Uid: 1005,
      NickName: '中国移动',
      NoteName: '',
      Gender: 1,
      Avatar: ''
    },
    {
      Uid: 1006,
      NickName: '人工客服',
      NoteName: '',
      Gender: 1,
      Avatar: ''
    },
    {
      Uid: 1007,
      NickName: '官方团队',
      NoteName: '',
      Gender: 1,
      Avatar: ''
    },
    {
      Uid: 1008,
      NickName: '小米',
      NoteName: '',
      Gender: 1,
      Avatar: ''
    },
    {
      Uid: 1009,
      NickName: '黄河',
      NoteName: '',
      Gender: 2,
      Avatar: ''
    },
    {
      Uid: 1010,
      NickName: '长江',
      NoteName: '',
      Gender: 1,
      Avatar: ''
    },
		{
      Uid: 1011,
      NickName: '高崎',
      NoteName: '',
      Gender: 1,
      Avatar: ''
    },
		{
      Uid: 1012,
      NickName: '123',
      NoteName: '',
      Gender: 1,
      Avatar: ''
    }
  ] // 朋友列表数据
};

const mutations = {
  /**
	 * 保存当前查看的朋友信息的uid
	 */
  SET_FRIEND_UID: (state, uid) => {
    state.checkfriendUid = uid;
  }
};

const actions = {
  /**
	 * 记录当前查看的朋友信息的uid
	 */
  setFriendUID({ commit }, uid) {
    commit('SET_FRIEND_UID', uid);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
