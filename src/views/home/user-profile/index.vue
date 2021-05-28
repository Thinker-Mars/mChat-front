<template>
  <div class="userInfo">
    <div class="icon">
      <img :src="loginUserInfo.Avatar">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'UserInfo',
	computed: {
    ...mapGetters([
			'loginUserInfo'
    ])
  }
};
</script>

<style lang="scss" scoped>
	.userInfo {
		display: inline-block;
		position: absolute;
		bottom: 0;
		margin-bottom: 6px;
		margin-left: 20px;
		.icon {
			width: 36px;
			height: 36px;
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
