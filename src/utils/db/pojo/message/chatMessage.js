import Message from './message';
import { CHAT_MESSAGE } from '@/utils/constants/message-constant';

class ChatMessage extends Message {
  /**
	 * @param {Number} uid 发送者uid
	 * @param {Number} targetUid 接收者uid
	 * @param {*} message 消息
	 * @param {Number} timeStamp 时间戳
	 */
  constructor(uid, targetUid, message, timeStamp) {
    super(CHAT_MESSAGE, timeStamp);
    this.uid = uid;
    this.targetUid = targetUid;
    this.message = message;
  }
}

export default ChatMessage;
