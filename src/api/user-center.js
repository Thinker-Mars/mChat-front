import request from '../utils/request';

/**
 * 登录
 * @param {Object} data
 */
export function login(data) {
  return request({
    url: '/userCenter/login',
    method: 'post',
    data: data,
		headers: {
			apikey: 'usercenter'
		}
  });
}

/**
 * 获取好友列表
 * @param {Object} data
 */
export function getFriendList(data) {
	return request({
    url: '/userCenter/getFriendList',
    method: 'post',
    data: data,
		headers: {
			apikey: 'usercenter'
		}
  });
}
