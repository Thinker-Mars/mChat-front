<template>
	<div class="bottom-menu">
		<div class="icon-container" @click="toggleMsg(true)">
			<div class="unreadmsg" v-show="totalUnreadMsgCount > 0">{{totalUnreadMsgCount}}</div>
			<img :src="msgSrc" class="bottom-menu-icon" data-msg="消息">
		</div>
		<div class="icon-container" @click="toggleIdea(true)">
			<img :src="ideaSrc" class="bottom-menu-icon" data-msg="想法">
		</div>
		<div class="icon-container" @click="toggleSetting(true)">
			<img :src="settingSrc" class="bottom-menu-icon" data-msg="设置">
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import msgUrl from "@/assets/img/bottom-menu/msg.svg";
import activeMsgUrl from "@/assets/img/bottom-menu/msg-active.svg";
import ideaUrl from "@/assets/img/bottom-menu/idea.svg";
import activeideaUrl from "@/assets/img/bottom-menu/idea-active.svg";
import settingUrl from "@/assets/img/bottom-menu/setting.svg";
import activeSettingUrl from "@/assets/img/bottom-menu/setting-active.svg";
export default {
	name: "bottom-menu",
	data() {
		return {
			msgSrc: activeMsgUrl,
			ideaSrc: ideaUrl,
			settingSrc: settingUrl
		}
	},
	computed: {
		...mapGetters([
			"selected",
			"currentUid",
			"totalUnreadMsgCount"
		])
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
				if (this.allowJump("chat")) {
					if (this.selected !== undefined) {
						// 存在已选中的聊天窗口，显示对应的聊天窗口
						if (this.allowJump2ChatWindow(this.currentUid)) {
							this.$router.push(`/home/chat/${this.currentUid}`);
						}
					} else {
						// 当前没有选中的聊天窗口，展示[消息]页即可
						this.$router.push("/home/chat");
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
				if (this.allowJump("idea")) {
					this.$router.push("/home/idea");
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
				if (this.allowJump("setting")) {
					this.$router.push("/home/setting");
				}
			} else {
				this.settingSrc = settingUrl;
			}
		},

		/**
		 * 判断是否允许跳转
		 * 如果当前页面与跳转页面一致，则不予跳转
		 * @param target 跳转的目标路由名称
		 */
		allowJump(target) {
			const { name } = this.$route;
			return name != target;
		},
		
		/**
		 * 判断是否允许跳转至聊天窗口路由
		 * @param {number} uid 用户id
		 */
		allowJump2ChatWindow(uid) {
			const { path } = this.$route;
			return path != `/home/chat/${uid}`;
		}
	}
}
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