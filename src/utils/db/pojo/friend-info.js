const FriendInfo = {
  columns: {
    Uid: {
      remark: '唯一id',
      unique: true
    },
    NickName: {
      remark: '昵称',
      unique: false
    },
    NoteName: {
      remark: '备注的名称',
      unique: false
    },
    Gender: {
      reamrk: '性别',
      unique: false
    },
    Avatar: {
      remark: '头像',
      unique: false
    },
		Home: {
			remark: '地区',
      unique: false
		},
		Motto: {
			remark: '座右铭',
      unique: false
		}
  },
	keyPath: 'Uid'
};

export default FriendInfo;
