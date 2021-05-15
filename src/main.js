import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { Button, Form, Input, Menu, Icon, Upload, Notification, Modal, FormModel } from 'ant-design-vue';
import { tellTime } from '@/utils/commonFun';

Vue.use(Form);
Vue.use(FormModel);
Vue.use(Input);
Vue.use(Button);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Upload);
Vue.use(Modal);

Vue.config.productionTip = false;

Vue.prototype.tellTime = tellTime;
Vue.prototype.$Notification = Notification;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
