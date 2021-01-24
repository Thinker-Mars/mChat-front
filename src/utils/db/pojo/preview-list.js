const PreviewList = {
	columns: {
		Uid: {
			remark: "用户唯一id",
			unique: true
		},
		Msg: {
			remark: "消息",
			unique: false
		},
		Timestamp: {
			remark: "消息产生的时间戳(ms)",
			unique: false
		}
	}
};

export default PreviewList;