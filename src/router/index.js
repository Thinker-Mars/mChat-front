import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
	/** 登录页 */
  {
    path: "/",
    name: "login",
		component: () => import("@/views/login/index"),
		meta: {
			keepAlive: false
		}
	},
	/** 主页 */
	{
		path: "/home",
    name: "new-home",
		component: () => import("@/views/new-home"),
		meta: {
			keepAlive: false
		},
		children: [
			/** 聊天 */
			{
				path: "chat",
				name: "chat",
				component: () => import("@/views/chat"),
				meta: {
					keepAlive: true
				},
				children: [
					/** 每一个聊天窗口 */
					{
						path: ":uid",
						name: "chatWindow",
						component: () => import("@/components/chat/chatWindow"),
						meta: {
							keepAlive: true
						}
					}
				]
			},
			/** 想法 */
			{
				path: "idea",
				name: "idea",
				component: () => import("@/views/idea"),
				meta: {
					keepAlive: true
				}
			},
			/** 设置 */
			{
				path: "setting",
				name: "setting",
				component: () => import("@/views/setting"),
				meta: {
					keepAlive: true
				}
			}
		]
	}
]

const router = new VueRouter({
	// electron 只有在路由模式为hash时，才可以正常运行
	mode: process.env.IS_ELECTRON ? "hash" : "history",
  base: process.env.BASE_URL,
  routes
})

export default router
