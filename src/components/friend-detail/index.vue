<template>
  <div class="friend-detail">
    <div class="first-impression">
      <div class="user-baseinfo">
        <span class="nickName">Cone</span>
        <img
          class="icon-gender top-4"
          src="@/assets/img/system/male.svg"
        >
        <div class="signature">
          未知全貌，不予置评
        </div>
      </div>
      <div class="user-avatar">
        <img src="@/assets/img/user/preview.jpg">
      </div>
    </div>
    <div class="info">
      <div class="content">
        <div class="name">
          备 注
        </div>
        <div class="value">
          Cone
        </div>
      </div>
      <div class="content">
        <div class="name">
          地 区
        </div>
        <div class="value">
          爱尔兰奥法利
        </div>
      </div>
      <div class="content">
        <div class="name">
          微信号
        </div>
        <div class="value">
          Thinker-Mars
        </div>
      </div>
      <div class="content">
        <div class="name">
          来 源
        </div>
        <div class="value">
          通过手机通讯录添加
        </div>
      </div>
    </div>
    <div class="send-msg">
      发消息
    </div>
  </div>
</template>

<script>
export default {
  name: 'FriendDetail',
  data() {
    return {

    };
  }
};
</script>

<style lang="scss" scoped>
.friend-detail {
	position: relative;
	width: 380px;
	margin: 20px auto 0;
}
.icon-gender {
	position: relative;
	width: 24px;
	height: 24px;
	user-select: none;
}
.first-impression {
	padding-top: 20px;
	padding-bottom: 20px;
	border-bottom: 1px solid #ededed;
	.user-baseinfo {
		display: inline-block;
		width: calc(100% - 80px);
		margin-right: 10px;
		text-align: left;
		.nickName {
			font-size: 24px;
			color: #060606;
		}
		.signature {
			margin-top: 10px;
			color: #a8b0b9;
			word-break: break-all;
		}
	}
	.user-avatar {
		display: inline-block;
		width: 70px;
		height: 70px;
		vertical-align: top;
	}
	.user-avatar img {
		width: 100%;
		height: 100%;
	}
}
.info {
	padding-top: 20px;
	padding-bottom: 20px;
	border-bottom: 1px solid #ededed;
}
.content {
	margin-bottom: 10px;
	font-size: 16px;
	.name {
		display: inline-block;
		width: 80px;
		color: #b6b6b6;
		user-select: none;
	}
	.value {
		display: inline-block;
		max-width: calc(100% - 80px);
		vertical-align: top;
		color: #28303d;
	}
}
.content:last-child {
	margin-bottom: 0;
}
.send-msg {
	width: 130px;
	margin: 30px auto 0;
	padding-top: 10px;
	padding-bottom: 10px;
	text-align: center;
	background-color: #1aad19;
	color: #fff;
	cursor: pointer;
	user-select: none;
}
.send-msg:hover {
	background-color: #129611;
}
.top-4 {
	top: -4px;
}
</style>
