<template>
  <div class="friend">
    <div class="container">
      <div class="left-preview">
        <div
          v-for="(groupedFriend, index) in groupedFriendList"
          :key="index"
          class="similar-group"
        >
          <div class="group-desc">
            {{ groupedFriend.desc }}
          </div>
          <div
            v-for="(friendInfo) in groupedFriend.list"
            :key="friendInfo.Uid"
            class="card"
          >
            <div class="img-container">
              <img src="@/assets/img/user/preview.jpg">
            </div>
            <div class="note">
              {{ friendInfo.NoteName || friendInfo.NickName }}
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
import { getFirstLetter } from '@/utils/pinyin-helper';
export default {
  name: 'Friend',
  data() {
    return {
			/**
			 * 分好组的好友列表
			 * 格式如下：
			 * [
			 * 	{
			 * 		desc: 'A',
			 * 		list: [
			 * 			{
			 * 				NickName: xxx,
			 * 				...
			 * 			},
			 * 			{
			 * 				NickName: xxx,
			 * 				...
			 * 			}
			 * 		]
			 * 	}
			 * ]
			 */
			groupedFriendList: {}
    };
  },
  computed: {
    ...mapGetters([
      'friendList',
      'selected'
    ])
  },
	watch: {
		friendList: {
			handler(friendList) {
				this.groupedFriendList = this.groupFriend(friendList);
			},
			immediate: true
		}
	},
	methods: {
		groupFriend(friendList) {
			const groupedFriendList = [];
			if (friendList.length === 0) {
				return groupedFriendList;
			}
			friendList.forEach((friendInfo) => {
				const { NickName, NoteName } = friendInfo;
				// 首先按照备注排序，如果没有备注，就按照昵称排序
				const judgeName = NoteName || NickName;
				// 获取首个字符
				const firstCharacter = judgeName.substring(0, 1);
				if (this.isEnglishCharacter(firstCharacter)) {
					// 英文字符开头
					this.dealEnglishCharacter(firstCharacter, friendInfo, groupedFriendList);
				} else if (this.isChineseCharacter(firstCharacter)) {
					// 中文字符开头
					this.dealChineseCharacter(firstCharacter, friendInfo, groupedFriendList);
				} else {
					// 其它字符开头，如数字等
					this.dealOtherCharacter('#', friendInfo, groupedFriendList);
				}
			});
			// 对列表进行排序
			this.sortFriendList(groupedFriendList);
			return groupedFriendList;
		},
		/**
		 * 判断是否是英文字符
		 */
		isEnglishCharacter(character) {
			return new RegExp('[A-Za-z]+').test(character);
		},
		/**
		 * 判断是否是中文字符
		 */
		isChineseCharacter(character) {
			return new RegExp('[\u4E00-\u9FA5]+').test(character);
		},
		/**
		 * 获取指定分组在列表的索引
		 */
		getGroupPosition(character, list) {
			return list.findIndex((element) => element.desc === character);
		},
		/**
		 * 对好友列表按照英文字母升序排列
		 * '#' 放在最后
		 */
		sortFriendList(groupedFriendList) {
			groupedFriendList.sort((firstEL, secondEL) => {
				return firstEL.desc.charCodeAt(0) - secondEL.desc.charCodeAt(0);
			});
			const position = this.getGroupPosition('#', groupedFriendList);
			if (position !== -1) {
				groupedFriendList.push(groupedFriendList.shift());
			}
		},
		/**
		 * 处理昵称以英文开头的好友信息
		 */
		dealEnglishCharacter(firstCharacter, friendInfo, groupedFriendList) {
			const upperCharacter = firstCharacter.toUpperCase();
			const position = this.getGroupPosition(upperCharacter, groupedFriendList);
			if (position !== -1) {
				groupedFriendList[position].list.push(friendInfo);
			} else {
				groupedFriendList.push({
					desc: upperCharacter,
					list: [friendInfo]
				});
			}
		},
		/**
		 * 处理昵称以中文开头的好友信息
		 */
		dealChineseCharacter(firstCharacter, friendInfo, groupedFriendList) {
			const firstLetter = getFirstLetter(firstCharacter);
			const position = this.getGroupPosition(firstLetter, groupedFriendList);
			if (firstLetter) {
				if (position !== -1) {
					groupedFriendList[position].list.push(friendInfo);
				} else {
					groupedFriendList.push({
						desc: firstLetter,
						list: [friendInfo]
					});
				}
			} else {
				this.dealChineseCharacter('#', friendInfo, groupedFriendList);
			}
		},
		/**
		 * 处理昵称以其它字符开头的好友信息
		 */
		dealOtherCharacter(firstCharacter, friendInfo, groupedFriendList) {
			const position = this.getGroupPosition(firstCharacter, groupedFriendList);
			if (position !== -1) {
				groupedFriendList[position].list.push(friendInfo);
			} else {
				groupedFriendList.push({
					desc: firstCharacter,
					list: [friendInfo]
				});
			}
		}
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
