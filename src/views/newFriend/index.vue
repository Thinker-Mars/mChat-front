<template>
	<div class="new-friend">
		<div class="page-title">
			新的朋友
		</div>
		<div class="choose-view">
			<span :class="chooseType === 'list' ? 'active' : ''" @click="checkApplyList">好友申请</span>
			<span :class="chooseType === 'add' ? 'active' : ''" @click="checkAddFriend">添加好友</span>
		</div>
		<!-- 好友申请 -->
		<div v-if="chooseType === 'list'" class="apply-list">
			<div class="card">
				<div class="img-container">
					<img src="@/assets/img/user/preview.jpg">
				</div>
				<div class="info">
					<div class="name">
						Cone
					</div>
					<div class="greet">
						你好
					</div>
					<div class="status">
						已添加
					</div>
				</div>
			</div>
		</div>
		<!-- 添加好友 -->
		<div v-if="chooseType === 'add'">
			添加好友
		</div>
	</div>
</template>

<script>
export default {
	name: 'NewFriend',
	data() {
		return {
			/**
			 * 当前查看的tab类型
			 * list：好友申请  add：添加好友
			 */
			chooseType: 'list'
		};
	},
	methods: {
		/**
		 * 点击「好友申请」
		 */
		checkApplyList() {
			this.chooseType = 'list';
		},
		/**
		 * 点击「添加好友」
		 */
		checkAddFriend() {
			this.chooseType = 'add';
		}
	}
};
</script>

<style scoped lang="scss">
.new-friend {
	user-select: none;
}
.page-title {
	padding-bottom: 14px;
	padding-left: 20px;
	font-size: 18px;
	color: #000000;
	border-bottom: 1px solid #dfdede;
}
.choose-view span {
	display: inline-block;
	width: 50%;
	height: 33px;
	line-height: 33px;
	border-bottom: 1px solid #dfdede;
	text-align: center;
	cursor: pointer;
}
.choose-view span:first-child {
	border-right: 1px solid #dfdede;
}
.choose-view span:hover {
	background-color: #dcdad9;
}
.choose-view span.active {
	background-color: #c7c6c5 !important;
}
.apply-list {
	width: 70%;
	margin: 0 auto;
	.card {
		padding: 20px 0;
		border-bottom: 1px solid #dfdede;
	}
	.img-container {
		display: inline-block;
		width: 54px;
		height: 54px;
		margin-right: 10px;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.info {
		position: relative;
		display: inline-block;
		vertical-align: middle;
		width: calc(100% - 64px);
		height: 54px;
		.name {
			position: absolute;
			top: 2px;
			color: #000000;
		}
		.status {
			position: relative;
			float: right;
			top: 14px;
			cursor: pointer;
		}
		.greet {
			position: absolute;
			bottom: 2px;
			color: #a8b0b9;
		}
	}
}
</style>
