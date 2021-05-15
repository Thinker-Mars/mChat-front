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

/**
 * 获取访问COS的临时密钥
 * @param {object} data 请求的参数
 */
export function getTmpCredential(data) {
  let query = '';
  if (Object.keys(data).length > 0) {
    for (const key in data) {
      query += `${key}=${data[key]}`;
    }
  }
  return request({
    url: `/userCenter/getTmpCredential?${query}`,
    method: 'get',
    data: data,
		headers: {
			apikey: 'usercenter'
		}
  });
}
