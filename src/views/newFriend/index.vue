<template>
	<div class="new-friend">
		<div class="sticky">
			<div class="page-title">
				新的朋友
			</div>
			<div class="choose-view">
				<span :class="chooseType === 'list' ? 'active' : ''" @click="checkApplyList">好友申请</span>
				<span :class="chooseType === 'add' ? 'active' : ''" @click="checkAddFriend">添加好友</span>
			</div>
		</div>
		<!-- 好友申请 -->
		<div v-if="chooseType === 'list'" class="apply-list">
			<div v-if="Object.keys(applyList).length === 0" class="no-apply">
				<img src="@/assets/img/system/no-match-friend.svg">
			</div>
			<div v-for="(applyUser, index) in applyList" v-else :key="index" class="card">
				<div class="img-container">
					<img src="@/assets/img/user/preview.jpg">
				</div>
				<div class="info">
					<div class="name">
						{{ applyUser.NickName }}
					</div>
					<div class="greet">
						{{ applyUser.Greet }}
					</div>
					<div class="operate">
						<a-button type="primary" @click="apply(applyUser.Uid)">
							同意
						</a-button>
					</div>
				</div>
			</div>
		</div>
		<!-- 添加好友 -->
		<div v-show="chooseType === 'add'" class="add-friend" spellcheck="false">
			<div class="type-to-search">
				<a-input-search placeholder="输入对方昵称 或 UID 进行搜索" style="width: 80%" @search="handleSearch" />
			</div>
			<div v-show="searching" class="loading">
				<a-spin />
			</div>
			<div v-show="!searching && matchList.length === 0" class="no-match-friend">
				<img src="@/assets/img/system/no-match-friend.svg">
			</div>
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
			chooseType: 'list',
			/**
			 * true表示正在搜索中
			 */
			searching: false,
			/**
			 * 好友申请列表
			 */
			applyList: [
				// {
				// 	Uid: 11111,
				// 	NickName: 'Cone',
				// 	Avatar: '',
				// 	Greet: '你好'
				// }
			],
			/**
			 * 搜索匹配的用户列表
			 */
			matchList: []
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
		},
		/**
		 * 同意好友申请
		 * @param uid 申请人的id
		 */
		apply(uid) {
			console.log(uid, 'uid');
		},
		handleSearch(value) {
			this.searching = true;
			setTimeout(() => {
				this.searching = false;
			}, 2000);
		}
	}
};
</script>

<style scoped lang="scss">
.new-friend {
	width: 100%;
	height: 100%;
	user-select: none;
}
.sticky {
	position: sticky;
	top: 0;
}
.page-title {
	height: 40px;
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
.no-apply {
	height: 100%;
	text-align: center;
	img {
		position: relative;
    top: 50%;
    transform: translateY(-50%);
	}
}
.apply-list {
  height: calc(100% - 73px);
	margin: 0 auto;
	overflow-y: auto;
	.card {
		width: 70%;
    margin: 0 auto;
		padding: 20px 0;
		border-bottom: 1px solid #dfdede;
	}
	.card:last-child {
		border-bottom: none;
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
			display: inline-block;
			max-width: 80%;
			top: 2px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			color: #000000;
		}
		.operate {
			position: relative;
			float: right;
			top: 12px;
		}
		.greet {
			position: absolute;
			display: inline-block;
			max-width: 80%;
			bottom: 2px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			color: #a8b0b9;
		}
	}
}
.apply-list::-webkit-scrollbar {
	width: 8px;
	height: 10px;
}
.apply-list::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background: #D8D8D8;
}
.add-friend {
	height: calc(100% - 73px);
}
.type-to-search {
	padding-top: 20px;
	padding-bottom: 10px;
	text-align: center;
}
.loading {
	height: 100px;
	line-height: 100px;
	text-align: center;
}
.no-match-friend {
	height: calc(100% - 62px);
	text-align: center;
	img {
		position: relative;
    top: 50%;
    transform: translateY(-50%);
	}
}
</style>
