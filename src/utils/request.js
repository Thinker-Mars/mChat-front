import axios from 'axios';

// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  baseURL: '/dev-api',
  timeout: 15000
});

service.interceptors.request.use(
  config => {
    return config;
  }
);

// 响应拦截器
service.interceptors.response.use(res => {
  return res.data;
}, err => {
  return Promise.reject(err);
});

export default service;
