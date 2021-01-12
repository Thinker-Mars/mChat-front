const state = {
	/**
	 * 预览消息，entry格式如下：
	 * {
	 *   uid: 用户唯一id
	 *   msg: 消息
	 *   timestamp: 消息产生的时间戳(ms)
	 * }
	 */
	msgList: [
		{
			uid: 1,
			msg: "新年好",
			timestamp: 1610287509000
		},
		{
			uid: 2,
			msg: "你在干嘛呢",
			timestamp: 1609571539943
		},
		{
			uid: 3,
			msg: "吃过了吗？",
			timestamp: 1609571539944
		},
		{
			uid: 4,
			msg: "新年好",
			timestamp: 1609571539945
		},
		{
			uid: 5,
			msg: "新年好",
			timestamp: 1609571539946
		},
		{
			uid: 6,
			msg: "新年好",
			timestamp: 1609571539947
		},
		{
			uid: 7,
			msg: "新年好",
			timestamp: 1609571539948
		}, 
		{
			uid: 8,
			msg: "新年好",
			timestamp: 1609571539949
		},
		{
			uid: 9,
			msg: "新年好",
			timestamp: 1609571539950
		}, 
		{
			uid: 10,
			msg: "新年好",
			timestamp: 1609571539951
		},
		{
			uid: 11,
			msg: "新年好",
			timestamp: 1609571539952
		}, 
		{
			uid: 12,
			msg: "新年好",
			timestamp: 1609571539953
		}
	]
};

const mutations = {
	/**
	 * 根据uid更新消息预览列表数据
	 * @param {*} state 
	 * @param {object} previewMsg 消息对象 包含如下信息：
	 * @param {number} uid 聊天对象的uid
	 * @param {*} msg 新消息
	 * @param {number} timestamp 消息产生的时间
	 */
	UPDATE_MSG: (state, previewMsg) => {
		let { msgList } = state;
		for (let i = 0; i < msgList.length; i++) {
			if (msgList[i].uid === previewMsg.uid) {
				const { uid, msg, timestamp } = previewMsg;
				msgList.splice(i, 1);
				msgList.unshift({ uid, msg, timestamp });
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
		let { msgList } = state;
		const { uid, msg, timestamp } = previewMsg;
		msgList.unshift({ uid, msg, timestamp });
	},
	/**
	 * 根据uid删除匹配的预览消息
	 * @param {*} state 
	 * @param {*} uid 要删除消息的uid
	 */
	DELETE_MSG: (state, uid) => {
		let { msgList } = state;
		for (let i = 0; i < msgList.length; i++) {
			if (msgList[i].uid === uid) {
				msgList.splice(i, 1);
				break;
			}
		}
	}
}

const actions = {
	updateMsg({ commit }, previewMsg) {
		commit("UPDATE_MSG", previewMsg);
	},
	addMsg({ commit }, previewMsg) {
		commit("ADD_MSG", previewMsg);
	},
	deleteMsg({ commit }, uid) {
		commit("DELETE_MSG", uid);
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}