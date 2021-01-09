<!-- 聊天窗口组件 -->
<template>
	<div class="chatWindow">
		<div class="name-box">
			<span class="name">Cone</span>
		</div>
		<div class="msg-info">
			<div class="receive-box">
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
			</div>
			<div class="sendout-box">
				<div class="time-box">
					<span class="time">16:56</span>
				</div>
				<div class="send-msg-box">
					<span class="send-msg">新年快乐！</span>
					<div class="chat-user-img">
						<div class="right-arrow"></div>
						<img src="@/assets/img/user/cone.jpg">
					</div>
				</div>
			</div>
		</div>
		<div class="enter-msg">
			<div class="chatBar">
				<emotion @chooseEmotion="chooseEmotion"/>
			</div>
			<div
				ref="enterMsg"
				class="msg-box"
				id="msg-box"
				contenteditable="true"
				spellcheck="false"
				@keydown.enter.prevent="sendMsg">
			</div>
			<div class="send-box">
				<span class="send-btn" @click="sendMsg">发送</span>
			</div>
		</div>
	</div>
</template>

<script>
import Emotion from "./emotion";
export default {
	name: "chatWindow",
	components: {
		Emotion
	},
	data() {
		return {
			uid: undefined,
			msgText: "",
			lastEditRange: undefined
		}
	},
	created() {
		const { uid } = this.$route.params;
		this.uid = uid;
	},
	methods: {

		sendMsg() {
			console.log(this.$refs.enterMsg.innerHTML)
			this.clearMsg();
		},

		clearMsg() {
			this.$refs.enterMsg.innerHTML = "";
		},

		chooseEmotion(index, src) {
			const imgElement = `<img src="${src}" width="24" height="24">`;
			document.execCommand("insertHTML", false, imgElement);
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
			}
		}
		.chat-user-img {
			display: inline-block;
			width: 34px;
			height: 34px;
			position: relative;
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