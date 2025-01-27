<template>
  <div class="bottom-menu">
    <div
      class="icon-container"
      @click="toggleMsg(true)"
    >
      <div
        v-show="totalUnreadMsgCount > 0"
        class="unreadmsg"
      >
        {{ totalUnreadMsgCount }}
      </div>
      <img
        :src="msgSrc"
        class="bottom-menu-icon"
        data-msg="消息"
      >
    </div>
    <div
      class="icon-container"
      @click="toggleFriend(true)"
    >
      <img
        :src="friendSrc"
        class="bottom-menu-icon"
        data-msg="朋友"
      >
    </div>
    <div
      class="icon-container"
      @click="toggleIdea(true)"
    >
      <img
        :src="ideaSrc"
        class="bottom-menu-icon"
        data-msg="想法"
      >
    </div>
    <div
      class="icon-container"
      @click="toggleSetting(true)"
    >
      <img
        :src="settingSrc"
        class="bottom-menu-icon"
        data-msg="设置"
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import msgUrl from '@/assets/img/bottom-menu/msg.svg';
import activeMsgUrl from '@/assets/img/bottom-menu/msg-active.svg';
import ideaUrl from '@/assets/img/bottom-menu/idea.svg';
import activeideaUrl from '@/assets/img/bottom-menu/idea-active.svg';
import settingUrl from '@/assets/img/bottom-menu/setting.svg';
import activeSettingUrl from '@/assets/img/bottom-menu/setting-active.svg';
import friendUrl from '@/assets/img/bottom-menu/friend.svg';
import activeFriendUrl from '@/assets/img/bottom-menu/friend-active.svg';
export default {
  name: 'BottomMenu',
  data() {
    return {
      msgSrc: activeMsgUrl,
      ideaSrc: ideaUrl,
      settingSrc: settingUrl,
      friendSrc: friendUrl
    };
  },
  computed: {
    ...mapGetters([
      'selected',
      'currentUid',
      'checkfriendUid',
      'totalUnreadMsgCount',
			'lookNewFriend'
    ])
  },
	watch: {
		'$route.path': function(newVal, oldVal) {
			// 前往 [朋友]页
			if (newVal.includes('/home/friend')) {
				this.friendSrc = activeFriendUrl;
				this.settingSrc = settingUrl;
				this.ideaSrc = ideaUrl;
				this.msgSrc = msgUrl;
			}
			// 前往 [消息]页
			if (newVal.includes('/home/chat')) {
				this.msgSrc = activeMsgUrl;
				this.friendSrc = friendUrl;
				this.settingSrc = settingUrl;
				this.ideaSrc = ideaUrl;
			}
			// 前往 [想法]页
			if (newVal.includes('/home/idea')) {
				this.ideaSrc = activeideaUrl;
				this.friendSrc = friendUrl;
				this.settingSrc = settingUrl;
				this.msgSrc = msgUrl;
			}
			// 前往 [设置]页
			if (newVal.includes('/home/setting')) {
				this.settingSrc = activeSettingUrl;
				this.friendSrc = friendUrl;
				this.ideaSrc = ideaUrl;
				this.msgSrc = msgUrl;
			}
		}
	},
  methods: {
    /**
		 * 切换[消息页]状态
		 * @param open true表示选中
		 */
    toggleMsg(open = true) {
      if (open) {
        this.msgSrc = activeMsgUrl;
        this.toggleIdea(false);
        this.toggleSetting(false);
        this.toggleFriend(false);
        if (this.allowJump('Chat')) {
          if (this.selected !== undefined) {
            // 存在已选中的聊天窗口，显示对应的聊天窗口
            if (this.allowJump2ChatWindow(this.currentUid)) {
              this.$router.push(`/home/chat/${this.currentUid}`);
            }
          } else {
            // 当前没有选中的聊天窗口，展示[消息]页即可
            this.$router.push('/home/chat');
          }
        }
      } else {
        this.msgSrc = msgUrl;
      }
    },
    /**
		 * 切换[想法页]状态
		 * @param open true表示打开
		 */
    toggleIdea(open = true) {
      if (open) {
        this.ideaSrc = activeideaUrl;
        this.toggleMsg(false);
        this.toggleSetting(false);
        this.toggleFriend(false);
        if (this.allowJump('Idea')) {
          this.$router.push('/home/idea');
        }
      } else {
        this.ideaSrc = ideaUrl;
      }
    },
    /**
		 * 切换[设置页]状态
		 * @param open true表示打开
		 */
    toggleSetting(open = true) {
      if (open) {
        this.settingSrc = activeSettingUrl;
        this.toggleMsg(false);
        this.toggleIdea(false);
        this.toggleFriend(false);
        if (this.allowJump('Setting')) {
          this.$router.push('/home/setting');
        }
      } else {
        this.settingSrc = settingUrl;
      }
    },
    /**
		 * 切换[朋友]状态
		 * @param open true表示打开
		 */
    toggleFriend(open = true) {
      if (open) {
        this.friendSrc = activeFriendUrl;
        this.toggleMsg(false);
        this.toggleIdea(false);
        this.toggleSetting(false);
        if (this.allowJump('Friend')) {
					if (this.lookNewFriend) {
						this.$route.path !== '/home/friend/newFriend' && this.$router.push('/home/friend/newFriend');
					} else {
						if (this.checkfriendUid !== undefined) {
							// 存在已选中的朋友窗口，显示对应的朋友信息窗口
							if (this.allowJump2FriendWindow(this.checkfriendUid)) {
								this.$router.push(`/home/friend/${this.checkfriendUid}`);
							}
						} else {
							// 当前没有选中的聊天窗口，展示[朋友]页即可
							this.$router.push('/home/friend');
						}
					}
        }
      } else {
        this.friendSrc = friendUrl;
      }
    },
    /**
		 * 判断是否允许跳转
		 * 如果当前页面与跳转页面一致，则不予跳转
		 * @param target 跳转的目标路由名称
		 */
    allowJump(target) {
      const { name } = this.$route;
      return name !== target;
    },
    /**
		 * 判断是否允许跳转至聊天窗口路由
		 * @param {number} uid 用户id
		 */
    allowJump2ChatWindow(uid) {
      const { path } = this.$route;
      return path !== `/home/chat/${uid}`;
    },
    /**
		 * 判断是否允许跳转至朋友信息窗口路由
		 * @param {number} uid 用户id
		 */
    allowJump2FriendWindow(uid) {
      const { path } = this.$route;
      return path !== `/home/friend/${uid}`;
    }
  }
};
</script>

<style scoped>
.bottom-menu {
	position: absolute;
	bottom: 0;
	height: 50px;
	line-height: 49px;
	width: 100%;
	text-align: center;
	box-sizing: border-box;
	border-top: 1px solid #C0C0C0;
}
.icon-container {
	margin-right: 100px;
	display: inline-block;
	cursor: pointer;
	position: relative;
}
.bottom-menu-icon {
	width: 25px;
	height: 25px;
}
.icon-container:last-child {
	margin-right: 0;
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
	left: 12px;
	top: 10px;
}
</style>
