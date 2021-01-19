<template>
	<div class="new-home">
		<keep-alive include="chat,setting,idea">
			<router-view></router-view>
		</keep-alive>
		<bottom-menu />
		<user-profile />
	</div>
</template>

<script>
import BottomMenu from "./bottom-menu";
import UserProfile from "./user-profile";
import { initDB } from "@/utils/db/dbUtil";
export default {
	name: "new-home",
	components: {
		BottomMenu,
		UserProfile
	},
	created() {
		initDB().then(
			db => {
				this.$store.dispatch("app/setDB", db);
			}
		);
		this.loginNotice();
	},
	methods: {
		/**
		 * 登录提示
		 */
		loginNotice() {
			const myNotification = new Notification(
				"mChat",
				{
					body: "hi，Cone，晚上好"
				}
			);
			myNotification.onclick = function() {
				myNotification.close();
			}
		}
	}
}
</script>

<style scoped>
.new-home {
	width: 100%;
	height: 100%;
}
</style>