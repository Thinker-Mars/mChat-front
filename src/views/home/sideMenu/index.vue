<template>
	<div class="sideMenu">
		<a-menu :default-selected-keys="['msg']" :inline-collapsed="true" mode="inline">
			<template v-for="item in menuList">
				<a-menu-item :key="item.key">
					<a-icon :type="item.icon" />
					<span>{{item.title}}</span>
				</a-menu-item>
			</template>
		</a-menu>
	</div>
</template>

<script>
export default {
	name: "sideMenu",
	data() {
		return {
			menuList: [
				{key: "msg", title: "消息", icon: "message"},
				{key: "friend", title: "联系人", icon: "contacts"},
				{key: "look", title: "看一看", icon: "global"},
				{key: "add", title: "添加", icon: "user-add"},
				{key: "setUp", title: "设置", icon: "setting"}
			],
			collapsed: false
		}
	},
	methods: {

	}
}
</script>

<style lang="scss">
	.sideMenu {
		display: inline-block;
		width: 80px;
		.ant-menu {
			display: inline-block;
		}
	}
</style>