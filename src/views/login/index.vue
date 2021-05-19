<template>
  <div class="login">
    <img src="@/assets/login-bg/1.jpg">
    <div class="login-form">
      <a-form-model
				ref="loginForm"
        :model="loginForm"
				:rules="rules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item label="UID" prop="Uid">
          <a-input v-model="loginForm.Uid" />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="Password">
					<a-input-password v-model="loginForm.Password" :visibilityToggle="false" />
        </a-form-model-item>
        <a-form-model-item class="login-btn">
          <a-button
            type="primary"
            html-type="submit"
						@click="handleSubmit"
          >
            登录
          </a-button>
        </a-form-model-item>
      </a-form-model>
			<a-button
				type="primary"
				html-type="submit"
				@click="register"
			>
				注册
			</a-button>
    </div>
  </div>
</template>

<script>
import { login, getFriendList, getPublicKey } from '@/api/user-center';
import { getOfflineMsg } from '@/api/msg-center';
import { initDB, patchAddRecord, truncateTable, dropDatabase, createChatTable } from '@/utils/db/dbUtil';
import { RequestCode } from '@/utils/constants/request-constant';
import { DATABASE_NAME, TABLE_LIST } from '@/utils/constants/db-constant';
import { encrypt } from '@/utils/commonFun';
export default {
  name: 'Login',
  data() {
    return {
			uid: undefined, // 登录时，记录uid，供获取 好友列表 与 离线消息使用
      loginForm: {
				Uid: undefined,
				Password: undefined
			},
			rules: {
				Uid: [
					{ required: true, message: '请输入UID', trigger: 'blur' }
				],
				Password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				]
			}
    };
  },
  methods: {
    handleSubmit() {
			const that = this;
			this.$refs.loginForm.validate((valid) => {
				if (valid) {
					that.$router.push({ path: '/home/chat' });
					// const { Uid, Password } = that.loginForm;
					// getPublicKey().then(
					// 	(res) => {
					// 		const PublicKey = res.data;
					// 		const loginData = {
					// 			Uid,
					// 			Password: encrypt(Password, PublicKey),
					// 			PublicKey
					// 		};
					// 		login(loginData).then(async(res) => {
					// 			if (res.code === RequestCode.Success) {
					// 				that.uid = Uid;
					// 				// 清空DB
					// 				await dropDatabase(DATABASE_NAME);
					// 				// 好友信息获取后，再跳转
					// 				await that.initDatabase();
					// 				// 获取离线消息
					// 				that.fetchOfflineMsg();
					// 				that.$store.dispatch('user/setUserInfo', res.data.userinfo);
					// 				// 建立socket连接，初始化监听
					// 				that.$store.dispatch('socket/connectSystem').then(() => {
					// 					that.$router.push({ path: '/home/chat' });
					// 				});
					// 			} else {
					// 				console.log(res.msg);
					// 			}
					// 		});
					// 	},
					// 	() => {

					// 	}
					// );
				}
			});
    },
		initDatabase() {
			return new Promise((resolve, reject) => {
				initDB(DATABASE_NAME).then(
					async() => {
						const friendList = await this.fetchFriendList();
						this.$store.dispatch('friend/setFriendList', JSON.parse(JSON.stringify(friendList)));
						this.initFriendList(friendList);
						resolve();
					}
				);
			});
		},
		/**
		 * 初始化好友列表
		 */
		initFriendList(friendList) {
			this.clearFriendList().then(
				() => {
					const msgMap = new Map();
					msgMap.set(TABLE_LIST.FriendInfo, JSON.parse(JSON.stringify(friendList)));
					patchAddRecord(msgMap);
				}
			);
		},
		/**
		 * 清空好友列表
		 */
		clearFriendList() {
			return new Promise((resolve, reject) => {
				truncateTable(TABLE_LIST.FriendInfo).then(
					() => {
						resolve();
					}
				);
			});
		},
		/**
		 * 获取好友列表
		 */
		async fetchFriendList() {
			const param = { uid: this.uid };
			const res = await getFriendList(param);
			return res.data.friendList;
		},
		/**
		 * 获取离线消息
		 */
		fetchOfflineMsg() {
			const queue = `${this.uid}-queue`;
			getOfflineMsg(queue).then(
				(res) => {
					if (res.length > 0) {
						this.batchSaveOfflineMsg(res);
						this.batchSavePreviewMsg(res);
					}
				}
			);
		},
		/**
		 * 将离线消息批量保存值DB
		 * @param {array} msgList 离线消息
		 */
		async batchSaveOfflineMsg(msgList) {
			const msgMap = new Map();
			msgList.forEach((msgMeta) => {
				const { ProducerID, Msg, Timestamp } = msgMeta;
				const tableName = `${ProducerID}-chat`;
				if (msgMap.has(tableName)) {
					msgMap.get(tableName).push({ Type: 1, Content: Msg, Timestamp });
				} else {
					msgMap.set(tableName, [{ Type: 1, Content: Msg, Timestamp }]);
				}
			});
			await this.batchCreateChatTable(msgMap);
			patchAddRecord(msgMap);
		},
		/**
		 * 批量创建聊天表
		 * @param {Map}
		 */
		async batchCreateChatTable(msgMap) {
			const msgIterator = msgMap.entries();
			let currentMsgGroup = msgIterator.next().value;
			while (currentMsgGroup) {
				await createChatTable(currentMsgGroup[0]);
				currentMsgGroup = msgIterator.next().value;
			}
		},
		/**
		 * 更新左侧预览数据
		 * 抽取每组消息的最后一条数据，作为预览数据
		 * @param {array} msgList 离线消息
		 */
		batchSavePreviewMsg(msgList) {
			const msgMap = new Map();
			msgList.forEach((msgMeta) => {
				const { ProducerID, Msg, Timestamp } = msgMeta;
				if (msgMap.has(ProducerID)) {
					msgMap.get(ProducerID).push({ Msg, Timestamp });
				} else {
					msgMap.set(ProducerID, [{ Msg, Timestamp }]);
				}
			});
			const previewList = [];
			const msgIterator = msgMap.entries();
			let currentMsgGroup = msgIterator.next().value;
			while (currentMsgGroup) {
				const Uid = currentMsgGroup[0];
				const msgList = currentMsgGroup[1];
				const { Msg, Timestamp } = msgList[msgList.length - 1];
				previewList.push({
					Uid,
					Msg,
					UnReadMsgCount: msgList.length,
					Timestamp
				});
				currentMsgGroup = msgIterator.next().value;
			}
			this.$store.dispatch('previewMsg/receiveOfflineMsg', previewList);
		},
		register() {
			this.$router.push({ path: '/register' });
		}
  }
};
</script>

<style scoped lang="scss">
	.login {
		width: 100%;
		height: 100%;
		position: relative;
		img {
			width: 100%;
			height: 100%;
		}

		.login-form {
			padding: 24px 24px 24px 30px;
			width: 348px;
			margin: 0 auto;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			border-radius: 4px;
			box-shadow: 0 1px 3px rgba(26,26,26,0.1);
			background-color: #FFFFFF;
			.ant-form {
				width: 300px;
				text-align: center;
				.login-btn {
					margin-bottom: 0;
					.ant-col-16 {
						width: unset;
					}
					.ant-col {
						text-align: center;
						.ant-form-item-control {
							display: inline-block;
							.ant-form-item-children {
								.ant-btn {
									width: 264px;
								}
							}
						}
					}
				}
			}

		}
	}
</style>
