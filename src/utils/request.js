import axios from 'axios';
import { REQUEST_CODE } from './constants/request-constant';

// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  baseURL: '/dev-api',
  timeout: 2000
});

service.interceptors.request.use(
  config => {
    return config;
  }
);

// 响应拦截器
service.interceptors.response.use(res => {
  // console.log(res, "res!");
  const { code } = res.data;
  if (REQUEST_CODE.SUCCESS === code) {
    // 请求成功
    return res.data;
  } else if (REQUEST_CODE.NO_PERMISSION === code) {
    // 无权限
    return Promise.reject('no permission');
  } else {
    // 请求失败
    return Promise.reject('fail');
  }
}, err => {
  return Promise.reject(err);
});

export default service;
