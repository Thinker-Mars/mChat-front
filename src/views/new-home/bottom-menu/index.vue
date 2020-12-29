<template>
	<div class="bottom-menu">
		<div class="icon-container" @click="toggleMsg(true)">
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
	methods: {
		toggleMsg(open = true) {
			if (open) {
				this.msgSrc = activeMsgUrl;
				this.toggleIdea(false);
				this.toggleSetting(false);
			} else {
				this.msgSrc = msgUrl;
			}
		},

		toggleIdea(open = true) {
			if (open) {
				this.ideaSrc = activeideaUrl;
				this.toggleMsg(false);
				this.toggleSetting(false);
			} else {
				this.ideaSrc = ideaUrl;
			}
		},

		toggleSetting(open = true) {
			if (open) {
				this.settingSrc = activeSettingUrl;
				this.toggleMsg(false);
				this.toggleIdea(false);
			} else {
				this.settingSrc = settingUrl;
			}
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
}
.bottom-menu-icon {
	width: 25px;
	height: 25px;
}
.icon-container:last-child {
	margin-right: 0;
}
</style>