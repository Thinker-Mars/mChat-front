const getters = {
	db: state => state.app.db,
	/** 当前登录用户唯一id */
	uid: state => state.user.uid,
	/** socket连接实例 */
	socket: state => state.socket.socket,
	/** 消息预览列表 */
	previewMsgList: state => state.previewMsg.msgList
}

export default getters