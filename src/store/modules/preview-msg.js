import router from '@/router';
const state = {
	/**
	 * 预览消息，entry格式如下：
	 * {
	 *   Uid: 用户唯一id
	 *   Msg: 消息
	 *   Timestamp: 消息产生的时间戳(ms)
	 *   UnReadMsgCount: 未读消息数
	 * }
	 */
	msgList: [
		{
			Uid: 1,
			Msg: '新年好',
			UnReadMsgCount: 4,
			Timestamp: 1610287509000
		},
		{
			Uid: 2,
			Msg: '你在干嘛呢',
			UnReadMsgCount: 1,
			Timestamp: 1609571539943
		},
		{
			Uid: 3,
			Msg: '吃过了吗？',
			UnReadMsgCount: 0,
			Timestamp: 1609571539944
		},
		{
			Uid: 4,
			Msg: '新年好',
			UnReadMsgCount: 0,
			Timestamp: 1609571539945
		},
		{
			Uid: 5,
			Msg: '新年好',
			UnReadMsgCount: 0,
			Timestamp: 1609571539946
		},
		{
			Uid: 6,
			Msg: '新年好',
			UnReadMsgCount: 0,
			Timestamp: 1609571539947
		},
		{
			Uid: 7,
			Msg: '新年好',
			UnReadMsgCount: 0,
			Timestamp: 1609571539948
		},
		{
			Uid: 8,
			Msg: '新年好',
			UnReadMsgCount: 0,
			Timestamp: 1609571539949
		},
		{
			Uid: 9,
			Msg: '新年好',
			UnReadMsgCount: 0,
			Timestamp: 1609571539950
		},
		{
			Uid: 10,
			Msg: '新年好',
			UnReadMsgCount: 0,
			Timestamp: 1609571539951
		},
		{
			Uid: 11,
			Msg: '新年好',
			UnReadMsgCount: 0,
			Timestamp: 1609571539952
		},
		{
			Uid: 12,
			Msg: '新年好',
			UnReadMsgCount: 0,
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
	currentUid: undefined,
	/**
	 * 预览列表未读消息总数
	 */
	totalUnreadMsgCount: 5
};

const mutations = {
	/**
	 * 根据uid更新消息预览列表数据
	 * @param {*} state
	 * @param {object} updateMsg 消息对象 包含如下信息：
	 * @param {number} Uid 聊天对象的uid
	 * @param {*} Msg 新消息
	 * @param {number} Timestamp 消息产生的时间
	 */
	UPDATE_MSG: (state, updateMsg) => {
		let { msgList } = state;
		const { Uid, Msg, Timestamp } = updateMsg;
		for (let i = 0; i < msgList.length; i++) {
			if (msgList[i].Uid === Uid) {
				msgList.splice(i, 1);
				msgList.unshift({ Uid, Msg, Timestamp });
				break;
			}
		}
	},
	/**
	 * 修改预览消息内容
	 * 删除聊天触发此操作
	 * @param {*} state
	 * @param {object} changeMsg
	 */
	CHANGE_MSG: (state, changeMsg) => {
		let { msgList } = state;
		const { Uid, Msg, Timestamp } = changeMsg;
		for (let i = 0; i < msgList.length; i++) {
			if (msgList[i].Uid === Uid) {
				msgList[i].Msg = Msg;
				msgList[i].Timestamp = Timestamp;
				break;
			}
		}
	},
	/**
	 * 预览列表新增一条消息
	 * @param {*} state
	 * @param {object} addMsg 消息对象(内容参考上面)
	 */
	ADD_MSG: (state, addMsg) => {
		let { msgList } = state;
		const { Uid, Msg, Timestamp } = addMsg;
		msgList.unshift({ Uid, Msg, Timestamp });
	},
	/**
	 * 根据uid删除匹配的预览消息
	 * @param {*} state
	 * @param {number} uid 要删除消息的uid
	 */
	DELETE_MSG: (state, uid) => {
		let { msgList } = state;
		for (let i = 0; i < msgList.length; i++) {
			if (msgList[i].Uid === uid) {
				msgList.splice(i, 1);
				if (state.selectedPreview !== undefined) {
					// 已有选中的窗口，如果当前删除的窗口在已选中窗口之上，那么激活窗口位置减一，恰好相同则表示删除当前激活窗口，之下不用管
					if (i < state.selectedPreview) {
						state.selectedPreview -= 1;
					} else if (i === state.selectedPreview) {
						state.selectedPreview = undefined;
						router.push('/home/chat');
					};
				}
				break;
			}
		}
	},
	/**
	 * 置顶预览消息
	 * @param {*} state
	 * @param {number} uid 要置顶的消息的uid
	 */
	PLACED_TOP_MSG: (state, uid) => {
		let { msgList } = state;
		for (let i = 0; i < msgList.length; i++) {
			if (msgList[i].Uid === uid) {
				const copyMsg = msgList.splice(i, 1);
				msgList.unshift(copyMsg[0]);
				if (state.selectedPreview !== undefined) {
					// 已有选中的窗口，如果想要置顶的窗口在已选中窗口之上，则不用管，恰好相同则置为0，之下则加一
					if (i > state.selectedPreview) {
						state.selectedPreview += 1;
					} else if (i === state.selectedPreview) {
						state.selectedPreview = 0;
					}
				}
				break;
			}
		}
	},
	/**
	 * 更新当前选中的窗口
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
	 * @param {number} uid 当前聊天对象的uid
	 */
	UPDATE_CURRENTUID: (state, uid) => {
		// 避免重复更新
		if (state.currentUid !== uid) {
			state.currentUid = uid;
		}
	},
	/**
	 * 查看消息，清空对应uid下的未读消息数
	 * @param {*} state
	 * @param {number} uid 当前聊天对象的uid
	 */
	CONFIRM_MSG: (state, uid) => {
		let { msgList } = state;
		for (let i = 0; i < msgList.length; i++) {
			if (msgList[i].Uid === uid && msgList[i].UnReadMsgCount !== 0) {
				const msgCount = msgList[i].UnReadMsgCount;
				msgList[i].UnReadMsgCount = 0;
				state.totalUnreadMsgCount -= msgCount;
			}
		}
	},
	/**
	 * 接收到新消息
	 * 判断消息预览窗口是否已存在，已存在则执行[更新]操作，没有则新建一个预览窗口
	 */
	RECEIVE_MSG: (state, receiveMsg) => {
		const { Uid, Msg, Timestamp } = receiveMsg;
		let { msgList } = state;
		for (let i = 0; i < msgList.length; i++) {
			// 更新消息
			if (msgList[i].Uid === Uid) {
				msgList[i].Msg = Msg;
				msgList[i].Timestamp = Timestamp;
				return;
			}
		}
		// 新建一个预览窗口
		msgList.unshift({ Uid, Msg, Timestamp });
	}
};

const actions = {
	/**
	 * 更新左侧消息预览列表的数据
	 * 已有预览消息，只更新
	 */
	updateMsg({ commit }, msg) {
		commit('UPDATE_MSG', msg);
	},
	/**
	 * 删除预览消息
	 */
	deleteMsg({ commit }, uid) {
		commit('DELETE_MSG', uid);
	},
	/**
	 * 右键菜单-消息置顶
	 */
	placedTopMsg({ commit }, uid) {
		commit('PLACED_TOP_MSG', uid);
	},
	/**
	 * 更新选中态
	 * 设置当前选择的窗口的index
	 */
	updateSelected({ commit }, index) {
		commit('UPDATE_SELECTED', index);
	},
	/**
	 * 更新当前聊天对象uid
	 */
	updateCurrentUid({ commit }, uid) {
		commit('UPDATE_CURRENTUID', uid);
	},
	/**
	 * 清除预览窗口的未读消息(如果有的话)
	 */
	confirmMsg({ commit }, uid) {
		commit('CONFIRM_MSG', uid);
	},
	/**
	 * 修改预览消息内容
	 * 删除聊天触发此操作
	 */
	changeMsg({ commit }, msg) {
		commit('CHANGE_MSG', msg);
	},
	/**
	 * 接收到消息
	 */
	receiveMsg({ commit }, msg) {
		commit('RECEIVE_MSG', msg);
	}
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};
