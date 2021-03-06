<template>
	<div class="container">
		<div class="home">
			<side-menu />
			<userProfile />
		</div>
		<div class="chat">
			<div class="send">
				<a-input placeholder="输入用户ID" style="width: 200px; margin-bottom: 20px;" v-model="tid"/>
				<a-textarea :maxLength="400" :autoSize="{minRows: 4, maxRows: 4}" placeholder="输入要发送的消息" style="width: 80%;margin-bottom: 20px;" v-model="sendMsg"/><br/>
				<a-button type="primary" @click="send" style="margin-bottom: 20px">发送消息</a-button><br/>
				<div>
					<span>你当前的会话ID:</span>
					{{tempUid}}
				</div>

			</div>
			<div class="receive" id="receive">
				<div v-for="msg in msgArr" :key="msg.timestamp" :class="1 == msg.type ? 'send-template' : 'receive-template' ">
					<span class="common-uid">{{msg.uid}}</span>
					<div class="common-msg">{{msg.msg}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import sideMenu from './sideMenu/index';
import userProfile from './userProfile/index';
import { genRandomNum } from '@/utils/commonFun';
export default {
	name: 'home',
	components: { sideMenu, userProfile },
	data() {
		return {
			tempUid: genRandomNum(6),
			tid: undefined,
			sendMsg: undefined,
			msgArr: [],
			socket: undefined
		};
	},
	created() {
		// this.socket = this.$store.getters.socket;
		// this.initEvent();
	},
	methods: {
		/**
		 * 初始化监听事件
		 */
		initEvent() {
			const that = this;
			that.socket.subscribe('connect', function() {
				that.initRoom();
			}, that);
			that.socket.subscribe('receiveUserMsg', function(data) {
				const { tid, msg } = data;
				that.renderMsg(tid, msg, 2);
			}, that);
		},

		/**
		 * 以UID作为room的key
		 */
		initRoom() {
			const { io } = this.socket;
			const socketId = io.id;
			const data = { uid: this.tempUid, socketId };
			io.emit('initUserRoom', data);
		},

		/**
		 * 发送消息
		 */
		send() {
			if (!this.tid || !this.sendMsg) {
				return;
			}
			const { io } = this.socket;
			const data = {
				uid: this.tempUid,
				msg: this.sendMsg,
				tid: this.tid
			};
			io.emit('sendMsgToUser', data);
			this.renderMsg(this.tempUid, data.msg, 1);
			this.sendMsg = '';
		},

		/**
		 * 将接收到的数据渲染至对话窗口
		 * @param {Number} uid 发送此条消息的人的uid
		 * @param {String} msg 消息内容
		 * @param {Number} type 消息类型，1:发送 2:接收
		 */
		renderMsg(uid = '', msg = '', type) {
			const timestamp = (new Date()).getTime();
			const _receive = document.getElementById('receive');
			this.msgArr.push({ timestamp, uid, msg, type });
			// 消息展示区域滚动至最下面
			setTimeout(function() {
				const top = _receive.scrollHeight;
				_receive.scroll({ top, behavior: 'smooth' });
			}, 0);
		}
	}
};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100%;
		.home {
			width: 80px;
			height: 100%;
			border-right: 1px solid #e8e8e8;
			position: relative;
			display: inline-block;
		}
		.chat {
			display: inline-block;
			width: calc(100% - 80px);
			vertical-align: top;
			height: 100%;
			.send {
				width: 50%;
				display: inline-block;
				padding: 10px;
				vertical-align: middle;
				textarea {
					resize: none;
				}
			}
			.receive {
				width: 50%;
				max-height: 80%;
				min-height: 20%;
				display: inline-block;
				padding: 10px;
				vertical-align: middle;
				box-sizing: border-box;
				border: 1px solid #C0C0C0;
				overflow-y: auto;
				.send-template {
					text-align: right;
				}
				.receive-template {
					text-align: left;
				}
				.common-msg {
					max-width: 20%;
					box-sizing: border-box;
					border: 1px solid #989898;
					display: inline-block;
					text-align: left;
					padding: 2px;
				}
				.common-uid {
					display: block;
				}
			}
		}
	}
</style>
