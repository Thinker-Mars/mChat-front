const getters = {
  /** 当前登录用户唯一id */
  uid: state => state.user.uid,
  /** socket连接实例 */
  socket: state => state.socket.socket,
  /** 消息预览列表 */
  previewMsgList: state => state.previewMsg.msgList,
  /** 当前选中预览窗口的索引 */
  selected: state => state.previewMsg.selectedPreview,
  /** 当前聊天对象的uid */
  currentUid: state => state.previewMsg.currentUid,
  /** 预览列表未读消息总数 */
  totalUnreadMsgCount: state => state.previewMsg.totalUnreadMsgCount
};

export default getters;
