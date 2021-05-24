import router from '@/router';
import { addRecord, getDataByKey, existTable, createChatTable } from '@/utils/db/dbUtil';
import { TABLE_LIST } from '@/utils/constants/db-constant';

const state = {
  /**
	 * 预览消息，entry格式如下：
	 * {
	 *   Uid: 用户唯一id
	 *   Msg: 消息
	 *   Timestamp: 消息产生的时间戳(ms)
	 *   UnReadMsgCount: 未读消息数
   *   Avatar: 预览头像,
   *   NickName: 昵称
	 * }
	 */
  msgList: [],
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
  totalUnreadMsgCount: 0
};

const mutations = {
  /**
	 * 根据uid更新消息预览列表数据
	 * 同时db存储收到的消息
	 * @param {*} state
	 * @param {object} updateMsg 消息对象 包含如下信息：
	 * @param {number} Uid 聊天对象的uid
	 * @param {*} Msg 新消息
	 * @param {number} Timestamp 消息产生的时间
	 * @param {number} MsgDirection 消息方向，1：接收 2：发送
	 */
  UPDATE_MSG: async(state, updateMsg) => {
    const { msgList } = state;
    const { Uid, Msg, Timestamp, MsgDirection } = updateMsg;
    let avatar = '';
    let nickName = '';
    for (let i = 0; i < msgList.length; i++) {
      if (msgList[i].Uid === Uid) {
        avatar = msgList[i].Avatar;
				nickName = msgList[i].NickName;
        msgList.splice(i, 1);
        break;
      }
    }
    if (!avatar) {
      const { data } = await getDataByKey(TABLE_LIST.FriendInfo, Uid);
      avatar = data.Avatar;
      nickName = data.NickName;
    }
    // 没有已存在的窗口，新建一个窗口
    msgList.unshift({ Uid, Msg, Timestamp, Avatar: avatar, NickName: nickName });
		const msgData = {
			Type: MsgDirection,
			Content: Msg,
			Timestamp
		};
		const tableName = `${Uid}-chat`;
		// 判断表是否存在
		const haveTable = await existTable(tableName);
		if (!haveTable) {
			await createChatTable(tableName);
		}
		addRecord(tableName, msgData);
  },
  /**
	 * 修改预览消息内容
	 * 删除聊天触发此操作
	 * @param {*} state
	 * @param {object} changeMsg
	 */
  CHANGE_MSG: (state, changeMsg) => {
    const { msgList } = state;
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
    const { msgList } = state;
    const { Uid, Msg, Timestamp } = addMsg;
    msgList.unshift({ Uid, Msg, Timestamp });
  },
  /**
	 * 根据uid删除匹配的预览消息
	 * @param {*} state
	 * @param {number} uid 要删除消息的uid
	 */
  DELETE_MSG: (state, uid) => {
    const { msgList } = state;
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
          }
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
    const { msgList } = state;
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
    const { msgList } = state;
    for (let i = 0; i < msgList.length; i++) {
      if (msgList[i].Uid === uid && msgList[i].UnReadMsgCount !== 0) {
        const msgCount = msgList[i].UnReadMsgCount;
        msgList[i].UnReadMsgCount = 0;
        state.totalUnreadMsgCount -= msgCount;
      }
    }
  },
  /**
	 * 更新未读消息数
	 */
  CNAHGE_MSG_COUNT: (state, uid, msgCount) => {
    const { currentUid } = state;
    // 当前打开窗口不是新消息来源者的时候，才累加未读消息数
    if (currentUid !== uid) {
      const { msgList } = state;
      for (let i = 0; i < msgList.length; i++) {
        if (msgList[i].Uid === uid) {
          msgList[i].UnReadMsgCount += msgCount;
          state.totalUnreadMsgCount += msgCount;
          break;
        }
      }
    }
  },
	/**
	 * 从好友名片页发起聊天
	 * 如果已存在预览窗口，就将其置顶，不存在就新建一个预览窗口
	 */
	CHECK_MSG_BY_UID: async(state, uid) => {
		const { msgList } = state;
		const pos = msgList.findIndex((msg) => msg.Uid === uid);
		if (pos !== -1) {
			const existMsg = msgList.splice(pos, 1)[0];
			msgList.unshift(existMsg);
		} else {
			// 没有已存在的窗口，新建一个窗口
      const { data } = await getDataByKey(TABLE_LIST.FriendInfo, uid);
			msgList.unshift(
        {
          Uid: uid,
          Msg: '',
          Timestamp: (new Date()).getTime(),
          UnReadMsgCount: 0,
          Avatar: data.Avatar,
          NickName: data.NickName
        });
		}
	},
	/**
	 * 保存离线消息
	 * @param {array} msgList 离线消息
	 */
	SAVE_OFFLINE_MSG: (state, offlineMsgList) => {
		const { msgList } = state;
		offlineMsgList.forEach((msg) => {
			msgList.push(msg);
			state.totalUnreadMsgCount += msg.UnReadMsgCount;
		});
	}
};

const actions = {
  /**
	 * 更新左侧消息预览列表的数据
	 * 已有预览消息，就更新消息，没有就新增一条
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
	 * 当用户在线时，收到消息后触发此行为
	 */
  receiveMsg({ commit }, data) {
    const { ProducerID, Msg, Timestamp } = data;
    // 更新消息
    commit('UPDATE_MSG', { Uid: ProducerID, Msg, Timestamp, MsgDirection: 1 });
    // 更新未读消息数
    commit('CNAHGE_MSG_COUNT', ProducerID, 1);
  },
	/**
	 * 保存收到的离线预览消息
	 * @param {array} msgList
	 */
	receiveOfflineMsg({ commit }, msgList) {
		commit('SAVE_OFFLINE_MSG', msgList);
	},
	/**
	 * 从好友名片页发起聊天
	 */
	chatFromFriendCard({ commit }, uid) {
		commit('CHECK_MSG_BY_UID', uid);
		commit('UPDATE_SELECTED', 0);
		commit('UPDATE_CURRENTUID', uid);
	}
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
