<!-- 聊天窗口组件 -->
<template>
	<div class="chatWindow">
		<!-- 聊天对象名称 -->
		<div class="name-box">
			<span class="name">Cone</span>
		</div>
		<div id="msg-info" class="msg-info">
			<div v-for="(msg, index) in msgList" :class="msg.Type === 1 ? 'receive-box' : 'sendout-box'" :key="index">
				<!-- 消息时间 -->
				<div class="time-box">
					<span class="time">{{tellTime(msg.Timestamp, 2)}}</span>
				</div>
				<!-- 接受到的消息 -->
				<div v-if="msg.Type === 1" class="receive-msg-box">
					<div class="chat-user-img">
						<img src="@/assets/img/user/preview.jpg">
					</div>
					<div class="receiver-outter">
						<div class="left-arrow"></div>
						<span class="receive-msg" v-html="msg.Content"></span>
					</div>
				</div>
				<!-- 发送的消息 -->
				<div v-else class="send-msg-box">
					<span class="send-msg" v-html="msg.Content"></span>
					<div class="chat-user-img">
						<div class="right-arrow"></div>
						<img src="@/assets/img/user/cone.jpg">
					</div>
				</div>
			</div>
			<!-- <div class="receive-box">
				<div class="time-box">
					<span class="time">15:41</span>
				</div>
				<div class="receive-msg-box">
					<div class="chat-user-img">
						<img src="@/assets/img/user/preview.jpg">
					</div>
					<div class="receiver-outter">
						<div class="left-arrow"></div>
						<span class="receive-msg">新年快乐！</span>
					</div>
				</div>
			</div> -->
			<!-- <div class="sendout-box">
				<div class="time-box">
					<span class="time">10:38</span>
				</div>
				<div class="send-msg-box">
					<span class="send-msg">新年好</span>
					<div class="chat-user-img">
						<div class="right-arrow"></div>
						<img src="@/assets/img/user/cone.jpg">
					</div>
				</div>
			</div> -->
		</div>
		<!-- 消息编辑区 -->
		<div class="enter-msg">
			<!-- 辅助操作区 -->
			<div class="chatBar">
				<!-- 选择表情 -->
				<emotion @chooseEmotion="chooseEmotion"/>
			</div>
			<!-- 输入消息 -->
			<div
				ref="enterMsg"
				class="msg-box"
				id="msg-box"
				contenteditable="true"
				spellcheck="false"
				@keydown.enter.prevent="sendMsg">
			</div>
			<!-- 发送消息 -->
			<div class="send-box">
				<span class="send-btn" @click="sendMsg">发送</span>
			</div>
		</div>
	</div>
</template>

<script>
import Emotion from "./emotion";
import { mapGetters } from 'vuex';
import {
	existTable,
	createChatTable,
	addRecord,
	countTableMsg,
	getHisMsg
} from "@/utils/db/dbUtil";
export default {
	name: "chatWindow",
	components: {
		Emotion
	},
	data() {
		return {
			friendUid: undefined, // 聊天对象的id
			chatTableName: undefined, // 聊天数据数据存储的表名称
			msgCount: 0, // 数据总量(查询历史记录需要)
			msgList: [
				{
					Type: 1,
					Content: "新年快乐！",
					Timestamp: 1610201109000
				},
				{
					Type: 2,
					Content: "新年好！",
					Timestamp: 1610288109000
				}
			]
		}
	},
	computed: {
		...mapGetters([
			"db"
		])
	},
	created() {
		this.initData();
		this.checkTableBeforeChat();
	},
	methods: {
		/**
		 * 初始化聊天组件基本数据
		 */
		initData() {
			const { Uid } = this.$route.params;
			this.friendUid = Number(Uid);
			this.chatTableName = `${this.friendUid}-chat`;
		},

		/**
		 * 发送消息
		 */
		sendMsg() {
			const msg = this.$refs.enterMsg.innerHTML;
			const timestamp = (new Date()).getTime();
			if (!msg) {
				return;
			}
			// 本地存储消息
			this.storageData(this.db, this.chatTableName, msg, timestamp);
			// 更新页面聊天数据
			this.updateChatMsgList(msg, timestamp);
			// 更新左侧预览列表数据
			this.updatePreviewMsg(msg, timestamp);
			// 清空输入框
			this.clearMsg();
			// 页面滚动至最新的那条信息的位置
			this.toLatestMsg();
		},

		/**
		 * 本地保存用户发送的消息
		 * @param {IDBDatabase} db
		 * @param {string} tableName 存储消息的数据表名称
		 * @param {string} msg 消息
		 * @param {number} timestamp 消息产生时间(ms)
		 */
		storageData(db, tableName, msg, timestamp) {
			const data = {
				Type: 2,
				Content: msg,
				Timestamp: timestamp
			};
			addRecord(db, tableName, data);
		},

		updateCount() {
			this.msgCount += 1;
		},

		/**
		 * 向此聊天窗口新增一条消息
		 * @param {} Content 新的消息内容
		 * @param {number} Timestamp 消息产生时间(ms)
		 */
		updateChatMsgList(Content, Timestamp) {
			const msg = {
				Type: 2,
				Content,
				Timestamp
			};
			this.msgList.push(msg);
		},

		/**
		 * 更新预览消息的信息
		 * @param {} Msg 新的消息内容
		 * @param {number} Timestamp 消息产生时间(ms)
		 */
		updatePreviewMsg(Msg, Timestamp) {
			const previewMsg = {
				Uid: this.friendUid,
				Msg,
				Timestamp
			};
			this.$store.dispatch("previewMsg/updateMsg", previewMsg);
			this.$store.dispatch("previewMsg/updateSelected", 0);
		},

		/**
		 * 清空消息
		 */
		clearMsg() {
			this.$refs.enterMsg.innerHTML = "";
		},

		/**
		 * 选择表情
		 * @param {number} index 表情的索引
		 * @param {string} src 表情的地址
		 */
		chooseEmotion(index, src) {
			document.getElementById("msg-box").focus();
			const imgElement = `<img src="${src}" width="24" height="24">`;
			document.execCommand("insertHTML", false, imgElement);
		},

		/**
		 * 页面滚动至最新的那条消息
		 */
		toLatestMsg() {
			let el = document.getElementById("msg-info");
			setTimeout(function() {
				let top = el.scrollHeight;
				el.scroll({top, behavior: "smooth"})
			});
		},

		/**
		 * 判断是否存在聊天的数据表
		 * 没有则新建
		 */
		checkTableBeforeChat() {
			const currentDB = this.db;
			const uid = this.friendUid;
			const tableName = `${uid}-chat`;
			if (!existTable(tableName, currentDB)) {
				// 表不存在，新建数据表
				currentDB.close();
				const currentVersion = currentDB.version;
				createChatTable(currentVersion, uid).then(
					(db) => {
						this.$store.dispatch("app/setDB", db);
					}
				);
			} else {
				// 表已存在，获取当前表中数据量
				countTableMsg(currentDB, tableName).then(
					(res) => {
						this.msgCount = res.data;
					}
				)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.chatWindow {
	width: 100%;
	height: 100%;
	.name-box {
		height: 46px;
		line-height: 46px;
		border-bottom: 1px solid #D0D0D0;
		.name {
			font-size: 20px;
			padding-left: 20px;
			color: #000000;
			user-select: none;
		}
	}
	.msg-info {
		height: calc(100% - 166px);
		overflow-y: auto;
		padding-left: 20px;
    	padding-right: 20px;
		padding-bottom: 10px;
		.receive-box {
			margin-top: 2px;
    		margin-bottom: 2px;
			.receive-msg-box {
				user-select: none;
				.receiver-outter {
					display: inline-block;
					width: calc(100% - 34px);
					vertical-align: top;
					position: relative;
					.receive-msg {
						margin-left: 10px;
						display: inline-block;
						padding: 6px;
						border: 1px solid #F0F0F0;
						color: #080808;
						border-radius: 4px;
						max-width: 50%;
						word-wrap: break-word;
					}
					.receive-msg:hover {
						background-color: #f6f6f6;
					}
				}
			}
		}
		.sendout-box {
			margin-top: 10px;
			.send-msg-box {
				text-align: right;
				user-select: none;
				.send-msg {
					display: inline-block;
					padding: 6px;
					border: 1px solid #F0F0F0;
					color: #080808;
					border-radius: 4px;
					vertical-align: top;
					max-width: 50%;
					margin-right: 10px;
					text-align: left;
					background-color: #9eea6a;
					word-wrap: break-word;
				}
				.send-msg:hover {
					background-color: #98e165;
				}
			}
		}
		.time-box {
			height: 20px;
			line-height: 20px;
			text-align: center;
			margin-bottom: 10px;
			.time {
				display: inline-block;
				height: 14px;
				line-height: 14px;
				box-sizing: initial;
				padding: 2px 4px;
				color: #fff;
				background-color: #D8D8D8;
				user-select: none;
			}
		}
		.chat-user-img {
			display: inline-block;
			width: 34px;
			height: 34px;
			position: relative;
			user-select: none;
			img {
				width: 34px;
				height: 34px;
			}
		}
		.left-arrow {
			width: 0px;
			height: 0px;
			display: inline-block;
			position: relative;
			left: 11px;
    		top: -2px;
			border-top: 6px solid transparent;
			border-bottom: 6px solid transparent;
			border-left: 0 solid transparent;
			border-right: 6px solid #E8E8E8;
		}
		.left-arrow::after {
			content: "";
			position: absolute;
			top: -5px;
    		left: 1px;
			border-top: 5px solid transparent;
			border-bottom: 5px solid transparent;
			border-left: 0 solid transparent;
			border-right: 5px solid #fff;
		}
		.left-arrow:hover {
			background-color: #f6f6f6;
		}
		.right-arrow {
			width: 0px;
			height: 0px;
			display: inline-block;
			position: absolute;
			left: -11px;
    		top: 10px;
			border-top: 6px solid transparent;
			border-bottom: 6px solid transparent;
			border-left: 6px solid #9eea6a;
			border-right: 0 solid transparent;
		}
		.right-arrow::after {
			content: "";
			position: absolute;
			top: -5px;
    		left: -7px;
			border-top: 5px solid transparent;
			border-bottom: 5px solid transparent;
			border-left: 5px solid #9eea6a;
			border-right: 0 solid transparent;
		}
	}
	.msg-info::-webkit-scrollbar {
		width: 8px;
		height: 10px;
	}
	.msg-info::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: #D8D8D8;
	}
	.enter-msg {
		height: 120px;
		border-top: 1px solid #D0D0D0;
		.chatBar {
			height: 26px;
			line-height: 26px;
			padding-left: 18px;
			padding-right: 18px;
		}
		.msg-box {
			height: calc(100% - 54px);
			overflow-y: auto;
			padding-left: 20px;
			padding-right: 20px;
			color: #000000;
		}
		.msg-box:focus {
			border: none;
			outline: none;
		}
		.msg-box::-webkit-scrollbar {
			width: 8px;
			height: 10px;
		}
		.msg-box::-webkit-scrollbar-thumb {
			border-radius: 10px;
			background: #D8D8D8;
		}
		.send-box {
			height: 28px;
			line-height: 28px;
			text-align: right;
			.send-btn {
				height: 20px;
				line-height: 20px;
				box-sizing: initial;
				display: inline-block;
				padding: 2px 12px;
				margin-right: 30px;
				border-radius: 4px;
				border: 1px solid #D8D8D8;
				background-color: #F0F0F0;
				cursor: pointer;
			}
			.send-btn:hover {
				background-color: #009900;
				border-color: #009900;
				color: #FFFFFF;
			}
		}
	}
}
</style>