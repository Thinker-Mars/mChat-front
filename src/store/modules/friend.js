import { addRecord } from '@/utils/db/dbUtil';
import { TABLE_LIST } from '@/utils/constants/db-constant';

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
	},
	/**
	 * 更新 [好友申请列表]
	 * @param {*} applyData 申请信息
	 */
	UPDATE_APPLY_LIST: (state, applyData) => {
		const { ProducerID, NickName, Avatar, Greet, Gender, Motto } = applyData;
		const { applyList } = state;
		let find = false;
		for (const apply of applyList) {
			// 若存在同一个人的申请，则更新打招呼的内容
			if (apply.ProducerID === ProducerID) {
				apply.Greet = Greet;
				find = true;
				break;
			}
		}
		if (!find) {
			applyList.push({ ProducerID, NickName, Avatar, Greet, Gender, Motto, Agree: false });
		}
	},
	/**
	 * 同意申请
	 * @param {number} applyID 申请人ID
	 */
	AGREE_APPLY: async(state, applyID) => {
		const { applyList, friendList } = state;
		for (const apply of applyList) {
			if (apply.ProducerID === applyID) {
				const { ProducerID, NickName, Avatar, Gender, Motto } = apply;
				// 更新页面好友列表
				friendList.push({ Uid: ProducerID, NickName, Avatar, Gender, Motto });
				// 更新db，因为查看好友详情时，会根据UID读取db
				await addRecord(TABLE_LIST.FriendInfo, { Uid: ProducerID, NickName, Avatar, Gender, Motto });
				apply.Agree = true;
			}
		}
	},
	/**
	 * 更新好友列表
	 * @param {object} friendInfo 好友信息
	 */
	UPDATE_FRIEND_LIST: async(state, friendInfo) => {
		const { friendList } = state;
		const { ProducerID, NickName, Avatar, Gender, Motto } = friendInfo;
		// 更新页面好友列表
		friendList.push({ Uid: ProducerID, NickName, Avatar, Gender, Motto });
		// 更新db，因为查看好友详情时，会根据UID读取db
		await addRecord(TABLE_LIST.FriendInfo, { Uid: ProducerID, NickName, Avatar, Gender, Motto });
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
	receiveApply({ commit }, applyData) {
		commit('UPDATE_APPLY_LIST', applyData);
	},
	/**
	 * 收到好友确认
	 * @param {object} friendInfo 好友信息
	 */
	receiveConfirm({ commit }, friendInfo) {
		commit('UPDATE_FRIEND_LIST', friendInfo);
	},
	/**
	 * 同意好友的申请
	 * @param {number} applyID
	 */
	agreeApply({ commit }, applyID) {
		commit('AGREE_APPLY', applyID);
	}
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
