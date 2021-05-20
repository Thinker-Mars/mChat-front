import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { Button, Input, Menu, Icon, Upload, Notification, Modal, FormModel, Tooltip, Radio, Spin } from 'ant-design-vue';
import { tellTime } from '@/utils/commonFun';

Vue.use(FormModel);
Vue.use(Input);
Vue.use(Button);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Upload);
Vue.use(Modal);
Vue.use(Tooltip);
Vue.use(Radio);
Vue.use(Spin);

Vue.config.productionTip = false;

Vue.prototype.tellTime = tellTime;
Vue.prototype.$Notification = Notification;
Vue.prototype.$Success = Modal.success;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
