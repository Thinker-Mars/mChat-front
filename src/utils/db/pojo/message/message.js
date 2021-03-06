/**
 * 系统内所有消息的实体，不允许直接实例化，应根据情况使用它的继承类
 */
class Message {
	/**
	 * @param {Number} messageType 消息类型 详见: constants/message-constant
	 * @param {Number} timeStamp 时间戳
	 */
	constructor(messageType, timeStamp) {
		this.messageType = messageType;
		this.timeStamp = timeStamp;
	};
}

export default Message;
