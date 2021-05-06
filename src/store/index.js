import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import socket from './modules/socket';
import getters from './getters';
import previewMsg from './modules/preview-msg';
import friend from './modules/friend';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    socket,
    previewMsg,
    friend
  },
  getters
});

export default store;
