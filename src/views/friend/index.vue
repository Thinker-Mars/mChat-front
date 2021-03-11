<template>
  <div class="friend">
    <div class="container">
      <div class="left-preview">
        <div class="similar-group">
          <div class="group-desc">
            A
          </div>
          <div class="card">
            <div class="img-container">
              <img src="@/assets/img/user/preview.jpg">
            </div>
            <div class="note">
              Allow
            </div>
          </div>
          <div class="card">
            <div class="img-container">
              <img src="@/assets/img/user/preview.jpg">
            </div>
            <div class="note">
              阿陈
            </div>
          </div>
          <div class="card">
            <div class="img-container">
              <img src="@/assets/img/user/preview.jpg">
            </div>
            <div class="note">
              AG超玩会
            </div>
          </div>
        </div>
        <div class="similar-group">
          <div class="group-desc">
            B
          </div>
          <div class="card">
            <div class="img-container">
              <img src="@/assets/img/user/preview.jpg">
            </div>
            <div class="note">
              必知必会
            </div>
          </div>
          <div class="card">
            <div class="img-container">
              <img src="@/assets/img/user/preview.jpg">
            </div>
            <div class="note">
              巴黎
            </div>
          </div>
        </div>
        <div class="similar-group">
          <div class="group-desc">
            C
          </div>
          <div class="card">
            <div class="img-container">
              <img src="@/assets/img/user/preview.jpg">
            </div>
            <div class="note">
              Cone
            </div>
          </div>
          <div class="card">
            <div class="img-container">
              <img src="@/assets/img/user/preview.jpg">
            </div>
            <div class="note">
              吃货
            </div>
          </div>
        </div>
        <div class="similar-group">
          <div class="group-desc">
            D
          </div>
          <div class="card">
            <div class="img-container">
              <img src="@/assets/img/user/preview.jpg">
            </div>
            <div class="note">
              大白
            </div>
          </div>
          <div class="card">
            <div class="img-container">
              <img src="@/assets/img/user/preview.jpg">
            </div>
            <div class="note">
              大哥
            </div>
          </div>
        </div>
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
	box-sizing: border-box;
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
	.similar-group {
		width: 100%;
		border-bottom: 1px solid gray;
	}
	.similar-group:last-child {
		border-bottom: none;
	}
	.group-desc {
		width: 100%;
		height: 20px;
		line-height: 20px;
		padding-left: 10px;
		font-size: 12px;
		color: gray;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.card {
		width: 100%;
		padding: 10px;
		cursor: pointer;
		.img-container {
			display: inline-block;
			width: 34px;
			height: 34px;
			img {
				width: 34px;
				height: 34px;
			}
		}
		.note {
			display: inline-block;
			width: calc(100% - 44px);
			margin-left: 10px;
			vertical-align: middle;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}
	.active {
		background-color: #c7c6c5 !important;
	}
	.card:hover {
		background-color: #dcdad9;
	}
	.right-window {
		float: right;
		width: calc(100% - 236px);
		height: 100%;
	}
}
</style>
