const state = {
	/**
	 * 预览消息，entry格式如下：
	 * {
	 *   Uid: 用户唯一id
	 *   Msg: 消息
	 *   Timestamp: 消息产生的时间戳(ms)
	 * }
	 */
	msgList: [
		{
			Uid: 1,
			Msg: "新年好",
			Timestamp: 1610287509000
		},
		{
			Uid: 2,
			Msg: "你在干嘛呢",
			Timestamp: 1609571539943
		},
		{
			Uid: 3,
			Msg: "吃过了吗？",
			Timestamp: 1609571539944
		},
		{
			Uid: 4,
			Msg: "新年好",
			Timestamp: 1609571539945
		},
		{
			Uid: 5,
			Msg: "新年好",
			Timestamp: 1609571539946
		},
		{
			Uid: 6,
			Msg: "新年好",
			Timestamp: 1609571539947
		},
		{
			Uid: 7,
			Msg: "新年好",
			Timestamp: 1609571539948
		}, 
		{
			Uid: 8,
			Msg: "新年好",
			Timestamp: 1609571539949
		},
		{
			Uid: 9,
			Msg: "新年好",
			Timestamp: 1609571539950
		}, 
		{
			Uid: 10,
			Msg: "新年好",
			Timestamp: 1609571539951
		},
		{
			Uid: 11,
			Msg: "新年好",
			Timestamp: 1609571539952
		}, 
		{
			Uid: 12,
			Msg: "新年好",
			Timestamp: 1609571539953
		}
	],
	/**
	 * 当前选择的预览窗口
	 */
	selectedPreview: undefined,
	/**
	 * 当前聊天对象的uid
	 */
	currentUid: undefined
};

const mutations = {
	/**
	 * 根据uid更新消息预览列表数据
	 * @param {*} state 
	 * @param {object} previewMsg 消息对象 包含如下信息：
	 * @param {number} Uid 聊天对象的uid
	 * @param {*} Msg 新消息
	 * @param {number} Timestamp 消息产生的时间
	 */
	UPDATE_MSG: (state, previewMsg) => {
		let { msgList, selectedPreview } = state;
		for (let i = 0; i < msgList.length; i++) {
			if (msgList[i].Uid === previewMsg.Uid) {
				const { Uid, Msg, Timestamp } = previewMsg;
				msgList.splice(i, 1);
				msgList.unshift({ Uid, Msg, Timestamp });
				selectedPreview = 0;
				break;
			}
		}
	},
	/**
	 * 预览列表新增一条消息
	 * @param {*} state 
	 * @param {object} previewMsg 消息对象(内容参考上面)
	 */
	ADD_MSG: (state, previewMsg) => {
		let { msgList, selectedPreview } = state;
		const { Uid, Msg, Timestamp } = previewMsg;
		msgList.unshift({ Uid, Msg, Timestamp });
		selectedPreview = 0;
	},
	/**
	 * 根据uid删除匹配的预览消息
	 * @param {*} state 
	 * @param {*} Uid 要删除消息的uid
	 */
	DELETE_MSG: (state, Uid) => {
		let { msgList } = state;
		for (let i = 0; i < msgList.length; i++) {
			if (msgList[i].Uid === Uid) {
				msgList.splice(i, 1);
				break;
			}
		}
	},
	/**
	 * 更新当前选中的预览窗口
	 * @param {*} state 
	 * @param {number} index 当前选中预览窗口的索引
	 */
	UPDATE_SELECTED: (state, index) => {
		// 避免重复更新
		if (state.selectedPreview !== index) {
			state.selectedPreview = index;
		}
	},
	/**
	 * 更新当前聊天对象的uid
	 * @param {*} state 
	 * @param {number} Uid 当前聊天对象的uid
	 */
	UPDATE_CURRENTUID: (state, Uid) => {
		// 避免重复更新
		if (state.currentUid !== Uid) {
			state.currentUid = Uid;
		}
	}
}

const actions = {
	updateMsg({ commit }, previewMsg) {
		commit("UPDATE_MSG", previewMsg);
	},
	addMsg({ commit }, previewMsg) {
		commit("ADD_MSG", previewMsg);
		commit("UPDATE_CURRENTUID", previewMsg.Uid);
	},
	deleteMsg({ commit }, Uid) {
		commit("DELETE_MSG", Uid);
	},
	updateSelected({ commit }, index) {
		commit("UPDATE_SELECTED", index);
	},
	updateCurrentUid({ commit}, Uid) {
		commit("UPDATE_CURRENTUID", Uid);
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}