import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-socket.io';
import {connect} from "./api/connect";
import { Button, Form, Input, Menu, Icon } from 'ant-design-vue';

Vue.use(Form);
Vue.use(Input);
Vue.use(Button);
Vue.use(Menu);
Vue.use(Icon);

Vue.config.productionTip = false

// 建立socket连接，返回socket连接地址
// 登录成功后，Redis中写入获取的UID

// 获取服务这个接口后续计划由网关提供
Vue.use(new VueSocketIO({
	debug: true,
	connection: "http://localhost:3000"
}));
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')


// connect().then(() => {
// 	Vue.use(new VueSocketIO({
// 		debug: true,
// 		connection: "http://localhost:3000"
// 	}));
// 	new Vue({
// 		router,
// 		store,
// 		render: h => h(App)
// 	}).$mount('#app')
// }, err => {
// 	console.log(err);
// })