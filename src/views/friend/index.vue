<template>
	<div class="friend">
		<div class="container">
			<div class="left-preview">

			</div>
			<div class="right-window">
				<keep-alive include="FriendDetail">
          <router-view :key="$route.params.Uid" />
        </keep-alive>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Friend',
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters([
      'friendList',
      'selected'
    ])
  }
};
</script>

<style lang="scss" scoped>
.friend {
	height: calc(100% - 50px);
}
.container {
	position: relative;
	width: 100%;
	height: 100%;
	.left-preview {
		float: left;
		width: 236px;
		height: 100%;
		overflow-y: auto;
		border-right: 1px solid #E8E8E8;
		user-select: none;
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
		float: right;
		width: calc(100% - 236px);
		height: 100%;
	}
}
</style>
