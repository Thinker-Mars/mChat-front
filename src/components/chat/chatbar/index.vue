<!-- 聊天窗口-消息发送区域的顶部bar，包含有表情等一些功能 -->
<template>
	<div class="chatBar">
		<emotion />
	</div>
</template>

<script>
import Emotion from "./emotion";
export default {
	name: "chatBar",
	components: {
		Emotion
	},
	data() {
		return {

		}
	}
}
</script>

<style lang="scss" scoped>
.chatBar {
	height: 26px;
	line-height: 26px;
	padding-left: 18px;
	padding-right: 18px;
}
</style>