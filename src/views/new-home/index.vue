<template>
  <div class="new-home">
    <keep-alive include="Chat,friend,Setting,Idea">
      <router-view />
    </keep-alive>
    <bottom-menu />
    <user-profile />
  </div>
</template>

<script>
import BottomMenu from './bottom-menu';
import UserProfile from './user-profile';
import { getDB, initDB, patchAddRecord, getLocalDBVersion, truncateTable } from '@/utils/db/dbUtil';
import { DATABASE_NAME, TABLE_LIST } from '@/utils/constants/db-constant';
import friendList from './mock-friendlist';
import { mapGetters } from 'vuex';
export default {
  name: 'NewHome',
  components: {
    BottomMenu,
    UserProfile
  },
	computed: {
    ...mapGetters([
      'uid'
    ])
  },
  created() {
    this.init();
    this.loginNotice();
  },
  methods: {
    init() {
      this.initDatabase();
      // this.initSocket();
    },
		initDatabase() {
			initDB(DATABASE_NAME).then(
				() => {
					// 调用接口，获取当前登录用户的好友信息，存入vuex，并写入indexeddb，数据暂时mock
					this.$store.dispatch('friend/setFriendList', JSON.parse(JSON.stringify(friendList)));
					this.initFriendList(friendList);
				}
			);
		},
		/**
		 * 初始化好友列表
		 */
		initFriendList(friendList) {
			this.clearFriendList().then(
				() => {
					const dbVersion = getLocalDBVersion();
					getDB(DATABASE_NAME, dbVersion).then(
						(db) => {
							patchAddRecord(db, TABLE_LIST.FriendInfo, JSON.parse(JSON.stringify(friendList)));
						}
					);
				}
			);
		},
		/**
		 * 清空好友列表
		 */
		clearFriendList() {
			return new Promise((resolve, reject) => {
				const dbVersion = getLocalDBVersion();
				getDB(DATABASE_NAME, dbVersion).then(
					(db) => {
						truncateTable(db, TABLE_LIST.FriendInfo).then(
							() => {
								resolve();
							}
						);
					}
				);
			});
		},
    initSocket() {
      this.$store.dispatch('socket/initEvent', { uid: this.uid, component: this });
    },
    /**
		 * 登录提示
		 */
    loginNotice() {
      const currentHour = (new Date()).getHours();
      const greet = this.getGreetByHour(currentHour);
      const myNotification = new Notification(
        'mChat',
        {
          body: greet
        }
      );
      myNotification.onclick = function() {
        myNotification.close();
      };
    },

    /**
		 * 根据当前时间，获取登录后，app打招呼的内容
		 * @param {number} hour 当前时间的hour
		 */
    getGreetByHour(hour) {
      if (hour < 6) {
        return 'Hi，Cone，这么晚没睡，出了什么事呢';
      }
      if (hour < 11) {
        return 'Hi，Cone，早上好';
      }
      if (hour < 14) {
        return 'Hi，Cone，中午好，午饭吃过了吗';
      }
      if (hour < 17) {
        return 'Hi，Cone，下午好';
      }
      if (hour < 22) {
        return 'Hi，Cone，晚上好';
      }
      return 'Hi，Cone，很晚了，快休息吧~';
    }
  }
};
</script>

<style scoped>
.new-home {
	width: 100%;
	height: 100%;
}
</style>
