const Chat = {
  columns: {
    Type: {
      remark: '消息来源, 1:接收, 2:发送',
      unique: false
    },
    Content: {
      remark: '消息',
      unique: false
    },
    Timestamp: {
      remark: '消息产生时间(ms)',
      unique: false
    }
  },
	autoIncrement: true
  // keyPath: 'Timestamp'
};

export default Chat;
