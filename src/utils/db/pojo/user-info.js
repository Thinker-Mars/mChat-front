const UserInfo = {
	columns: {
		Uid: {
			remark: '唯一id',
			unique: true
		},
		NickName: {
			remark: '昵称',
			unique: false
		},
		Gender: {
			remark: '性别',
			unique: false
		},
		BirthDay: {
			remark: '生日',
			unique: false
		},
		Avatar: {
			remark: '头像',
			unique: false
		}
	}
};

export default UserInfo;
