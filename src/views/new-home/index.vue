<template>
  <div class="new-home">
    <keep-alive include="Chat,Setting,Idea">
      <router-view />
    </keep-alive>
    <bottom-menu />
    <user-profile />
  </div>
</template>

<script>
import BottomMenu from './bottom-menu';
import UserProfile from './user-profile';
import { initDB } from '@/utils/db/dbUtil';
export default {
	name: 'NewHome',
	components: {
		BottomMenu,
		UserProfile
	},
	created() {
		initDB().then(
			db => {
				this.$store.dispatch('app/setDB', db);
			}
		);
		this.loginNotice();
		this.$store.dispatch('socket/initEvent', { uid: 666, component: this });
	},
	methods: {
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
