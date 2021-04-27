const getters = {
  /** 当前登录用户唯一id */
  uid: (state) => state.user.userInfo.Uid,
	/** 当前登录用户的昵称 */
	userNickName: (state) => state.user.userInfo.NickName,
  /** [朋友]页打开的朋友信息的uid */
  checkfriendUid: (state) => state.friend.checkfriendUid,
  /** 朋友列表 */
  friendList: (state) => state.friend.friendList,
  /** socket连接实例 */
  socket: (state) => state.socket.socket,
  /** 消息预览列表 */
  previewMsgList: (state) => state.previewMsg.msgList,
  /** 当前选中预览窗口的索引 */
  selected: (state) => state.previewMsg.selectedPreview,
  /** 当前选中朋友信息窗口的索引 */
  selectedFriendIndex: (state) => state.friend.selected,
  /** 当前聊天对象的uid */
  currentUid: (state) => state.previewMsg.currentUid,
  /** 预览列表未读消息总数 */
  totalUnreadMsgCount: (state) => state.previewMsg.totalUnreadMsgCount
};

export default getters;
