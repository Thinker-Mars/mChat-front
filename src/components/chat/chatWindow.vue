<!-- 聊天窗口组件 -->
<template>
  <div class="chatWindow">
    <!-- 聊天对象名称 -->
    <div class="name-box">
      <span class="name">{{ friendInfo.NickName }}</span>
    </div>
    <div
      id="msg-info"
      class="msg-info"
    >
      <div
        v-for="(msg, index) in msgList"
        :key="index"
        :class="msg.Type === 1 ? 'receive-box' : 'sendout-box'"
      >
        <!-- 消息时间 -->
        <div class="time-box">
          <span class="time">{{ tellTime(msg.Timestamp, 2) }}</span>
        </div>
        <!-- 接受到的消息 -->
        <div
          v-if="msg.Type === 1"
          class="receive-msg-box"
        >
          <div class="chat-user-img">
            <img :src="friendInfo.Avatar">
          </div>
          <div class="receiver-outter">
            <div class="left-arrow" />
            <span
              class="receive-msg"
              @contextmenu="rightClick"
              @mouseenter="recordMsg(msg)"
              v-html="msg.Content"
            />
          </div>
        </div>
        <!-- 发送的消息 -->
        <div
          v-else
          class="send-msg-box"
        >
          <span
            class="send-msg"
            @contextmenu="rightClick"
            @mouseenter="recordMsg(msg)"
            v-html="msg.Content"
          />
          <div class="chat-user-img">
            <div class="right-arrow" />
            <img :src="loginUserInfo.Avatar">
          </div>
        </div>
      </div>
    </div>
    <!-- 消息编辑区 -->
    <div class="enter-msg">
      <!-- 辅助操作区 -->
      <div class="chatBar">
        <!-- 选择表情 -->
        <emotion @chooseEmotion="chooseEmotion" />
      </div>
      <!-- 输入消息 -->
      <div
        id="msg-box"
        ref="enterMsg"
        class="msg-box"
        contenteditable="true"
        spellcheck="false"
        @keydown.enter.prevent="sendMsg"
      />
      <!-- 发送消息 -->
      <div class="send-box">
        <span
          class="send-btn"
          @click="sendMsg"
        >
          发送
        </span>
      </div>
    </div>
    <right-click
      ref="rightClick"
      :command-list="rightClickCommand"
      @handleExecCommand="handleExecCommand"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Emotion from '@/components/chat/emotion';
import RightClick from '@/components/right-click';
import { TABLE_LIST } from '@/utils/constants/db-constant';
import {
  existTable,
  createChatTable,
  addRecord,
	getDataByKey,
	getHisMsg
} from '@/utils/db/dbUtil';
export default {
  name: 'ChatWindow',
  components: {
    Emotion, RightClick
  },
  data() {
    return {
      friendUid: undefined, // 聊天对象的id
      chatTableName: undefined, // 聊天数据数据存储的表名称
			friendInfo: {}, // 聊天对象的信息
      tempMsg: {}, // hover的消息(辅助右键菜单)
      rightClickCommand: [
        {
          name: '转发',
          commandKey: 'forwardMsg'
        },
        {
          name: '删除',
          commandKey: 'deleteMsg'
        }
      ], // 右键菜单命令配置
      msgList: []
    };
  },
  computed: {
    ...mapGetters([
			'loginUserInfo'
    ])
  },
  created() {
		const { Uid } = this.$route.params;
		if (Uid) {
			this.initData();
			this.checkTableBeforeChat();
		}
  },
  methods: {
    /**
		 * 初始化聊天组件基本数据
		 */
    initData() {
      const { Uid } = this.$route.params;
      this.friendUid = Number(Uid);
      this.chatTableName = `${this.friendUid}-chat`;
			this.initFriendInfo();
    },

		/**
		 * 根据uid，获取好友信息
		 */
		initFriendInfo() {
			getDataByKey(TABLE_LIST.FriendInfo, this.friendUid).then(
				(res) => {
					this.friendInfo = res.data;
				}
			);
		},

		/**
		 * 判断是否存在聊天的数据表
		 * 没有则新建
		 */
    async checkTableBeforeChat() {
      const tableName = `${this.friendUid}-chat`;
			// 判断表是否存在
			const haveTable = await existTable(tableName);
			if (haveTable) {
				// 首次打开时，获取所有数据
				const msgRes = await getHisMsg(tableName, 'all');
				this.msgList = JSON.parse(JSON.stringify(msgRes.data));
			} else {
				// 表不存在，创建聊天表
				createChatTable(tableName);
			}
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
      this.storageData(this.chatTableName, msg, timestamp);
      // 更新页面聊天数据
      this.updateChatMsgList(msg, timestamp);
      // 更新左侧预览列表数据
      this.updatePreviewMsg(msg, timestamp);
      // 将消息发给朋友
      this.sendToFriend(this.loginUserInfo.Uid, this.friendUid, msg, timestamp);
      // 清空输入框
      this.clearMsg();
      // 页面滚动至最新的那条信息的位置
      this.toLatestMsg();
    },

    /**
		 * 本地保存用户发送的消息
		 * @param {string} tableName 存储消息的数据表名称
		 * @param {string} msg 消息
		 * @param {number} timestamp 消息产生时间(ms)
		 */
    storageData(tableName, msg, timestamp) {
      const data = {
        Type: 2,
        Content: msg,
        Timestamp: timestamp
      };
      addRecord(tableName, data);
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
      this.$store.dispatch('previewMsg/updateMsg', previewMsg);
      this.$store.dispatch('previewMsg/updateSelected', 0);
    },

    /**
		 * 清空消息
		 */
    clearMsg() {
      this.$refs.enterMsg.innerHTML = '';
    },

    /**
		 * 将消息发给朋友
		 * @param {Number} ProducerID 消息的生产者uid（即谁发送的消息）
		 * @param {Number} ConsumerID 消息的消费者uid（即消息要发给谁）
		 * @param {String} Msg 发送的消息
		 * @param {Number} Timestamp 消息产生的时间戳
		 */
    sendToFriend(ProducerID, ConsumerID, Msg, Timestamp) {
      this.$store.dispatch('socket/sendMsg', { ProducerID, ConsumerID, Msg, Timestamp });
    },

    /**
		 * 选择表情
		 * @param {number} index 表情的索引
		 * @param {string} src 表情的地址
		 */
    chooseEmotion(index, src) {
      document.getElementById('msg-box').focus();
      const imgElement = `<img src="${src}" width="24" height="24">`;
      document.execCommand('insertHTML', false, imgElement);
    },

    /**
		 * 页面滚动至最新的那条消息
		 */
    toLatestMsg() {
      const el = document.getElementById('msg-info');
      setTimeout(function() {
        const top = el.scrollHeight;
        el.scroll({ top, behavior: 'smooth' });
      });
    },

    /**
		 * 打开右键菜单
		 */
    rightClick(e) {
      const { pageX, pageY } = e;
      this.$refs.rightClick.open(pageX, pageY, 64);
      e.preventDefault();
    },

    /**
		 * 记录hover时的消息
		 * 辅助右键菜单的功能
		 * @param msg hover选中的消息
		 */
    recordMsg(msg) {
      if (this.tempMsg.Type + this.tempMsg.Timestamp !== msg.Type + msg.Timestamp) {
        this.tempMsg = msg;
      }
    },

    /**
		 * 处理右键菜单的事件
		 * @param {string} commandKey 要执行的命令
		 */
    handleExecCommand(commandKey) {
      if (commandKey && this.tempMsg) {
        if (commandKey === 'forwardMsg') {
          // 暂未实现
        }
        if (commandKey === 'deleteMsg') {
          this.deleteMsg(this.tempMsg);
        }
      }
    },

    /**
		 * 删除指定的聊天记录
		 * @param {object} msg 要删除的消息
		 */
    deleteMsg(msg) {
      for (let i = 0; i < this.msgList.length; i++) {
        if (this.msgList[i].Type === msg.Type && this.msgList[i].Timestamp === msg.Timestamp) {
          if (i === this.msgList.length - 1 && this.msgList.length > 1) {
            // 删除的是页面最后一条记录，删除后，需要更新左侧预览消息内容为上一条消息
            const newPreviewMsg = {
              Uid: this.friendUid,
              Msg: this.msgList[i - 1].Content,
              Timestamp: this.msgList[i - 1].Timestamp
            };
            this.$store.dispatch('previewMsg/changeMsg', newPreviewMsg);
          }
          this.msgList.splice(i, 1);
          break;
        }
      }
    }

  }
};
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
