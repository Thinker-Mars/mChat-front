<template>
	<div class="chat">
		<div class="container">
			<div class="left-preview">
				<div v-for="(preview, index) in previewMsgList"
					:key="index"
					:class="selected == index ? 'preview active' : 'preview'"
					@click="checkMsgDetail(index, preview.uid)"
				>
					<div class="img-box">
						<img src="@/assets/img/user/preview.jpg">
					</div>
					<div class="msg-box">
						<div class="top">
							<span class="name">Cone</span>
							<span class="time">{{tellTime(preview.timestamp, 1)}}</span>
						</div>
						<div class="bottom" v-html="preview.msg"></div>
					</div>
				</div>
			</div>
			<div class="right-window">
				<keep-alive include="chatWindow">
					<router-view :key="$route.params.uid"></router-view>
				</keep-alive>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	name: "chat",
	data() {
		return {
			
		}
	},
	computed: {
		...mapGetters([
			"previewMsgList",
			"selected"
		])
	},
	methods: {
		/**
		 * 有信息到达，更新/新增[预览]窗口
		 * @param {number} uid 用户的唯一ID
		 * @param {string} msg 要展示的消息
		 */
		addPreview(uid, msg) {

		},
		/**
		 * 删除[预览]窗口
		 * @param {number} index 索引
		 */
		deletePreview(index) {

		},
		/**
		 * 获取用户的头像
		 * @param {number} uid 用户的唯一ID
		 */
		getProfile(uid) {

		},
		/**
		 * 点击[预览]，查看消息
		 * @param {number} index 该条预览信息的索引
		 * @param {number} uid 预览消息的发送者id
		 */
		checkMsgDetail(index, uid) {
			// 更新当前选中窗口信息
			this.$store.dispatch("previewMsg/updateSelected", index);
			// 更新当前聊天对象uid
			this.$store.dispatch("previewMsg/updateCurrentUid", uid);
			if (this.allowJump(uid)) {
				// 查看消息
				this.$router.push(`/home/chat/${uid}`);
			}
		},
		/** 
		 * 判断是否允许跳转
		 * 避免重复跳转同一路由
		 * @param {number} uid 用户id
		 */
		allowJump(uid) {
			const { path } = this.$route;
			return path != `/home/chat/${uid}`;
		}
	}
	
}
</script>

<style lang="scss" scoped>
.chat {
	height: calc(100% - 50px);
}
.container {
	width: 100%;
	height: 100%;
	position: relative;
	.left-preview {
		width: 236px;
		height: 100%;
		float: left;
		overflow-y: auto;
		border-right: 1px solid #E8E8E8;
		user-select: none;
		.preview {
			position: relative;
			height: 68px;
			padding: 10px 16px 10px 16px;
			cursor: pointer;
			.img-box {
				display: inline-block;
				vertical-align: top;
				width: 48px;
				height: 48px;
				img {
					width: 48px;
					height: 48px;
				}
			}
			.msg-box {
				display: inline-block;
				position: relative;
				margin-left: 6px;
				width: calc(100% - 54px);
				height: 100%;
				.top {
					position: absolute;
					width: 100%;
					top: 0;
					.name {
						display: inline-block;
						text-align: left;
						color: #000000;
						font-size: 16px;
					}
					.time {
						float: right;
						font-size: 12px;
					}
				}
				.bottom {
					position: absolute;
					bottom: 0;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					width: 130px;
					font-size: 12px;
				}
			}
		}
		.preview:hover {
			background-color: #dcdad9;
		}
		.active {
			background-color: #c7c6c5 !important;
		}
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
		width: calc(100% - 236px);
		height: 100%;
		float: right;
	}
}
</style>