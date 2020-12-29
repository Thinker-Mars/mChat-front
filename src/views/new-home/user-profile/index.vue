<template>
	<div class="userInfo">
		<div class="icon">
			<img src="@/assets/img/user/cone.jpg">
		</div>
	</div>
</template>

<script>
export default {
	name: "userInfo",
	data() {
		return {

		}
	},
	methods: {

	}
}
</script>

<style lang="scss" scoped>
	.userInfo {
		display: inline-block;
		position: absolute;
		bottom: 0;
		margin-bottom: 8px;
		margin-left: 20px;
		.icon {
			width: 32px;
			height: 32px;
			text-align: center;
			img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
				cursor: pointer;
			}
		}
	}
</style>