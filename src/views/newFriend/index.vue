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
					<img :src="applyUser.Avatar">
				</div>
				<div class="info">
					<div class="name">
						{{ applyUser.NickName }}
					</div>
					<div class="greet">
						{{ applyUser.Greet }}
					</div>
					<div v-show="!applyUser.Agree" class="operate">
						<a-button type="primary" @click="apply(applyUser.ProducerID)">
							同意
						</a-button>
					</div>
					<div v-show="applyUser.Agree" class="operate">
						<a-button type="primary">
							发消息
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
			<!-- 加载中效果 -->
			<div v-show="searching" class="loading">
				<a-spin />
			</div>
			<div v-show="!searching && matchList.length === 0" class="no-match-friend">
				<img src="@/assets/img/system/no-match-friend.svg">
			</div>
			<div
				v-for="(matchUser, index) in matchList"
				v-show="!searching && matchList.length !== 0"
				:key="index"
				class="card"
			>
				<div class="img-container">
					<img :src="matchUser.Avatar">
				</div>
				<div class="info">
					<div class="name">
						{{ matchUser.NickName }}
					</div>
					<div class="motto">
						{{ matchUser.Motto }}
					</div>
					<div class="operate">
						<a-button type="primary" @click="add(matchUser.Uid)" :disabled="matchUser.hasSendApply">
							添加
						</a-button>
					</div>
				</div>
			</div>
		</div>
		<a-modal
      v-model="showApply"
      title="申请添加好友"
      centered
			:maskClosable="false"
			okText="发送"
      @ok="handleOK"
    >
			<a-input v-model="greet" placeholder="打个招呼吧~" />
    </a-modal>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getUser, addFriend } from '@/api/user-center';
import { RequestCode } from '@/utils/constants/request-constant';
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
			 * 搜索匹配的用户列表
			 */
			matchList: [],
			/**
			 * 记录前一次的查询关键字
			 */
			oldKeyword: undefined,
			/**
			 * 是否展示 [好友申请]对话框
			 */
			showApply: false,
			/**
			 * 申请添加好友时，打招呼的内容
			 */
			greet: '',
			/**
			 * 记录当前欲添加的好友ID
			 */
			currentApplyUID: undefined
		};
	},
	computed: {
    ...mapGetters([
      'loginUserInfo',
			'applyList'
    ])
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
		apply(applyID) {
			this.$store.dispatch('friend/agreeApply', applyID);
			const param = {
				Uid: this.loginUserInfo.Uid,
				FriendUid: applyID
			};
			addFriend(param).then(
				(res) => {
					if (res.code === RequestCode.Success) {
						this.$store.dispatch(
							'socket/sendFriendConfirm',
							{
								ProducerID: this.loginUserInfo.Uid,
								ConsumerID: applyID,
								NickName: this.loginUserInfo.NickName,
								Avatar: this.loginUserInfo.Avatar,
								Gender: this.loginUserInfo.Gender,
								Motto: this.loginUserInfo.Motto
							}
						);
						this.successTip('操作成功', '添加成功，现在可以开始聊天啦~');
					}
				}
			);
		},
		/**
		 * 添加好友
		 * @param uid 用户id
		 */
		add(Uid) {
			this.currentApplyUID = Uid;
			this.openApplyModal();
		},
		/**
		 * 将 [发送申请标志] 更改为 [已发送]
		 * @param {number} Uid 对方UID
		 */
		changeSendFlag(Uid) {
			const pos = this.matchList.findIndex((user) => user.Uid === Uid);
			if (pos !== -1) {
				this.matchList[pos].hasSendApply = true;
			}
		},
		openApplyModal() {
			this.showApply = true;
		},
		closeApplyModal() {
			this.showApply = false;
		},
		/**
		 * 处理 [好友申请]对话框 的 确认
		 */
		handleOK() {
			this.changeSendFlag(this.currentApplyUID);
			this.$store.dispatch(
				'socket/sendFriendApply',
				{
					ProducerID: this.loginUserInfo.Uid,
					ConsumerID: this.currentApplyUID,
					NickName: this.loginUserInfo.NickName,
					Avatar: this.loginUserInfo.Avatar,
					Greet: this.greet,
					Gender: this.loginUserInfo.Gender,
					Motto: this.loginUserInfo.Motto
				}
			);
			this.closeApplyModal();
			this.successTip('操作成功', '好友申请已发送给ta啦');
			this.greet = '';
			this.currentApplyUID = undefined;
		},
		/**
		 * 根据关键字搜索用户
		 * @param {string} value 关键字
		 */
		handleSearch(Keyword) {
			// 没有输入关键字 | 正在查询中 | 查询参数没变 情况下，不进行搜索
			if (!Keyword || this.searching || this.oldKeyword === Keyword) {
				return;
			}
			const { Uid } = this.loginUserInfo;
			const param = { Uid, Keyword };
			this.searching = true;
			this.oldKeyword = Keyword;
			getUser(param).then(
				(res) => {
					if (res.code === RequestCode.Success) {
						const { matchUser } = res.data;
						this.matchList = matchUser.map((user) => {
							user.hasSendApply = false;
							return user;
						});
					}
				},
				(err) => {
					console.log(err);
				}
			).finally(
				() => {
					this.searching = false;
				}
			);
		},
		/**
		 * 成功提示
		 * @param {string} message 提示title
		 * @param {string} description 提示内容
		 */
		successTip(message, description) {
			this.$Notification.open({
				message,
				description,
				icon: <a-icon type="check" style="color: #2E8B57"/>
			});
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
}
.apply-list::-webkit-scrollbar {
	width: 8px;
	height: 10px;
}
.apply-list::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background: #D8D8D8;
}
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
	.greet, .motto {
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
.add-friend {
	height: calc(100% - 73px);
	overflow-y: auto;
}
.add-friend::-webkit-scrollbar {
	width: 8px;
	height: 10px;
}
.add-friend::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background: #D8D8D8;
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
