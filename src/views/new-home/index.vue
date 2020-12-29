<template>
	<div class="new-home">
		<bottom-menu />
		<user-profile />
	</div>
</template>

<script>
import BottomMenu from "./bottom-menu";
import UserProfile from "./user-profile";
export default {
	name: "new-home",
	components: {
		BottomMenu,
		UserProfile
	}
}
</script>

<style scoped>
.new-home {
	width: 100%;
	height: 100%;
}
</style>