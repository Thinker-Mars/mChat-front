<template>
  <div class="chat">
    <div class="container">
      <div class="left-preview">
        <div
          v-for="(preview, index) in previewMsgList"
          :key="index"
          :class="selected == index ? 'preview active' : 'preview'"
          @click="checkMsgDetail(index, preview.Uid)"
          @mouseenter="recordPreviewMsg(preview)"
          @contextmenu="rightClick"
        >
          <div
            v-show="preview.UnReadMsgCount > 0"
            class="unreadmsg"
          >
            {{ preview.UnReadMsgCount }}
          </div>
          <div class="img-box">
            <img :src="preview.Avatar">
          </div>
          <div class="msg-box">
            <div class="top">
              <span class="name">{{ preview.NickName }}</span>
              <span class="time">{{ tellTime(preview.Timestamp, 1) }}</span>
            </div>
            <div
              class="bottom"
              v-html="preview.Msg"
            />
          </div>
        </div>
      </div>
      <div class="right-window">
        <keep-alive include="ChatWindow">
          <router-view :key="$route.params.Uid" />
        </keep-alive>
      </div>
      <right-click
        ref="rightClick"
        :command-list="rightClickCommand"
        @handleExecCommand="handleExecCommand"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import RightClick from '@/components/right-click';
export default {
  name: 'Chat',
  components: {
    RightClick
  },
  data() {
    return {
      /** 右键菜单命令配置 */
      rightClickCommand: [
        {
          name: '置顶',
          commandKey: 'placedTop'
        },
        {
          name: '删除聊天',
          commandKey: 'deletePreviewMsg'
        }
      ],
      tempPreviewMsg: {}
    };
  },
  computed: {
    ...mapGetters([
      'previewMsgList',
      'selected'
    ])
  },
  methods: {
    /**
		 * 删除某预览窗口
		 * @param {number} Uid 用户唯一id
		 */
    deletePreview(Uid) {
      this.$store.dispatch('previewMsg/deleteMsg', Uid);
    },
    /**
		 * 置顶某预览窗口
		 * @param {number} Uid 用户唯一id
		 */
    placedTopPreview(Uid) {
      this.$store.dispatch('previewMsg/placedTopMsg', Uid);
    },
    /**
		 * 点击[预览]，查看消息
		 * @param {number} index 该条预览信息的索引
		 * @param {number} Uid 预览消息的发送者id
		 */
    checkMsgDetail(index, Uid) {
      // 更新当前选中窗口信息
      this.$store.dispatch('previewMsg/updateSelected', index);
      // 更新当前聊天对象uid
      this.$store.dispatch('previewMsg/updateCurrentUid', Uid);
      // 清除未读消息(如果有的话)
      this.$store.dispatch('previewMsg/confirmMsg', Uid);
      if (this.allowJump(Uid)) {
        // 查看消息
        this.$router.push(`/home/chat/${Uid}`);
      }
    },
    /**
		 * 判断是否允许跳转
		 * 避免重复跳转同一路由
		 * @param {number} Uid 用户id
		 */
    allowJump(Uid) {
      const { path } = this.$route;
      return path !== `/home/chat/${Uid}`;
    },
    /*
		 * 打开右键菜单
		 */
    rightClick(e) {
      const { pageX, pageY } = e;
      this.$refs.rightClick.open(pageX, pageY);
      e.preventDefault();
    },
    /**
		 * 处理右键菜单的事件
		 * @param {string} commandKey 要执行的命令
		 */
    handleExecCommand(commandKey) {
      if (commandKey && this.tempPreviewMsg) {
        if (commandKey === 'placedTop') {
          // 置顶
          this.placedTopPreview(this.tempPreviewMsg.Uid);
        }
        if (commandKey === 'deletePreviewMsg') {
          // 删除聊天
          this.deletePreview(this.tempPreviewMsg.Uid);
        }
      }
    },
    /**
		 * 临时记录hover的预览消息
		 * 辅助右键菜单的功能
		 * @param previewMsg hover选中的预览消息内容
		 */
    recordPreviewMsg(previewMsg) {
      if (previewMsg.Uid !== this.tempPreviewMsg.Uid) {
        // 避免重复记录
        this.tempPreviewMsg = previewMsg;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.chat {
	height: calc(100% - 50px);
}
.container {
	width: 100%;
	height: 100%;
	position: relative;
	.left-preview {
		width: 236px;
		height: 100%;
		float: left;
		overflow-y: auto;
		border-right: 1px solid #E8E8E8;
		user-select: none;
		.preview {
			position: relative;
			height: 68px;
			padding: 10px 16px 10px 16px;
			cursor: pointer;
			.img-box {
				display: inline-block;
				vertical-align: top;
				width: 48px;
				height: 48px;
				img {
					width: 48px;
					height: 48px;
				}
			}
			.msg-box {
				display: inline-block;
				position: relative;
				margin-left: 6px;
				width: calc(100% - 54px);
				height: 100%;
				.top {
					position: absolute;
					width: 100%;
					top: 0;
					.name {
						display: inline-block;
						width: 100%;
						text-align: left;
						color: #000000;
						font-size: 16px;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}
					.time {
						float: right;
						font-size: 12px;
					}
				}
				.bottom {
					position: absolute;
					bottom: 0;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					width: 130px;
					font-size: 12px;
				}
			}
		}
		.preview:hover {
			background-color: #dcdad9;
		}
		.active {
			background-color: #c7c6c5 !important;
		}
	}
	.left-preview::-webkit-scrollbar {
		width: 8px;
		height: 10px;
	}
	.left-preview::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: #D8D8D8;
	}
	.right-window {
		width: calc(100% - 236px);
		height: 100%;
		float: right;
	}
	.unreadmsg {
		position: absolute;
		min-width: 16px;
		min-height: 16px;
		line-height: 16px;
		text-align: center;
		border-radius: 50%;
		background-color: #fa5151;
		color: #fff;
		left: 52px;
		top: 4px;
	}
}
</style>
