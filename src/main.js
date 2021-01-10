import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {connect} from "./api/connect";
import { Button, Form, Input, Menu, Icon } from 'ant-design-vue';
import { tellTime } from "@/utils/commonFun";

Vue.use(Form);
Vue.use(Input);
Vue.use(Button);
Vue.use(Menu);
Vue.use(Icon);

Vue.config.productionTip = false;

Vue.prototype.tellTime = tellTime;

// 建立socket连接，返回socket连接地址
// 登录成功后，Redis中写入获取的UID

// 获取服务这个接口后续计划由网关提供
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')