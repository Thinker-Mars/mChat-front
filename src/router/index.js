import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
	/** 登录页 */
  {
    path: '/',
    name: 'login',
    component: () => import("@/views/login/index")
	},
	/** 主页 */
	{
		path: '/home',
    name: 'new-home',
    component: () => import("@/views/new-home/index")
	}
]

const router = new VueRouter({
	// electron 只有在路由模式为hash时，才可以正常运行
	mode: process.env.IS_ELECTRON ? "hash" : "history",
  base: process.env.BASE_URL,
  routes
})

export default router
