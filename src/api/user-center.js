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

/**
 * 获取好友列表
 * @param {Object} data
 */
export function getFriendList(data) {
	return request({
    url: '/usercenter/getFriendList',
    method: 'post',
    data: data
  });
}
