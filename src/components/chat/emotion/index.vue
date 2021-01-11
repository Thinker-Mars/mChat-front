<template>
	<div class="emotion">
		<img src="@/assets/img/chatbar/emotion.svg" class="emotion-switch" @click="openToggle">
		<div class="emotion-box" v-show="showEmotion">
			<div v-for="(emotion, index) in emotionList" :key="index" class="emotion-img" @click="chooseEmotion(index, emotion.src)">
				<img :src="emotion.src">
			</div>
		</div>
	</div>
</template>

<script>
import EmotionList from "./emotionList";
export default {
	name: "emotion",
	data() {
		return {
			showEmotion: false,
			emotionList: EmotionList
		}
	},
	methods: {
		openToggle() {
			this.showEmotion = !this.showEmotion;
		},
		chooseEmotion(index, src) {
			this.$emit("chooseEmotion", index, src);
			this.openToggle();
		}
	}
}
</script>

<style lang="scss" scoped>
.emotion {
	display: inline-block;
	position: relative;
	width: 22px;
	height: 22px;
	padding: 2px;
	line-height: 22px;
	box-sizing: initial;
	.emotion-switch {
		width: 22px;
		height: 22px;
		vertical-align: top;
		cursor: pointer;
	}
	.emotion-box {
		position: absolute;
		width: 330px;
		height: 200px;
		bottom: 26px;
		padding: 10px;
		overflow-y: auto;
		border: 1px solid #D0D0D0;
		background-color: #F8F8F8;
	}
	.emotion-box::-webkit-scrollbar {
		width: 8px;
		height: 10px;
	}
	.emotion-box::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: #D8D8D8;
	}
	.emotion-img {
		display: inline-block;
		width: 24px;
		height: 24px;
		line-height: 24px;
		padding: 4px;
		box-sizing: initial;
		cursor: pointer;
		img {
			width: 24px;
			height: 24px;
		}
	}
	.emotion-img:hover {
		background-color: #e7e7e7;
	}
}
.emotion:hover {
	background-color: #F0F0F0;
	border-radius: 2px;
}
</style>