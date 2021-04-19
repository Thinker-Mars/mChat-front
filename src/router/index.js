import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  /** 登录页 */
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/login/index'),
    meta: {
      keepAlive: false
    }
  },
  /** 主页 */
  {
    path: '/home',
    name: 'NewHome',
    component: () => import('@/views/new-home/index'),
    meta: {
      keepAlive: false
    },
    children: [
      /** 聊天 */
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('@/views/chat/index'),
        meta: {
          keepAlive: true
        },
        children: [
          /** 每一个聊天窗口 */
          {
            path: ':Uid',
            name: 'ChatWindow',
            component: () => import('@/components/chat/chatWindow'),
            meta: {
              keepAlive: true
            }
          }
        ]
      },
      /** 好友列表 */
      {
        path: 'friend',
        name: 'Friend',
        component: () => import('@/views/friend/index'),
        meta: {
          keepAlive: true
        },
        children: [
          /** 好友信息 */
          {
            path: ':friendUid',
            name: 'FriendDetail',
            component: () => import('@/components/friend-detail/index'),
            meta: {
              keepAlive: true
            }
          }
        ]
      },
      /** 想法 */
      {
        path: 'idea',
        name: 'Idea',
        component: () => import('@/views/idea/index'),
        meta: {
          keepAlive: true
        }
      },
      /** 设置 */
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/setting/index'),
        meta: {
          keepAlive: true
        }
      }
    ]
  }
];

const router = new VueRouter({
  // electron 只有在路由模式为hash时，才可以正常运行
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;

