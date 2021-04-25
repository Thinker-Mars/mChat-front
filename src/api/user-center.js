import request from '../utils/request';

/**
 * 登录
 * @param {Object} data
 */
export function login(data) {
  return request({
    url: '/usercenter/login',
    method: 'post',
    data: data
  });
}
