import request from '../utils/request';

/**
 * 将参数对象转为 key=value 形式的字符穿
 * @param {object} data 参数对象
 */
function genQuery(data) {
  let query = '';
  if (Object.keys(data).length > 0) {
    for (const key in data) {
      query += `${key}=${data[key]}&`;
    }
  }
  if (query.length > 0) {
    return query.substring(0, query.length - 1);
  }
  return query;
}

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
 * 用户注册
 * @param {Object} data
 */
export function register(data) {
  return request({
    url: '/userCenter/register',
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
  const query = genQuery(data);
  return request({
    url: `/userCenter/getTmpCredential?${query}`,
    method: 'get',
    data: data,
		headers: {
			apikey: 'usercenter'
		}
  });
}

/**
 * 获取非对称加密的公钥
 */
export function getPublicKey() {
  return request({
    url: '/userCenter/getPublicKey',
    method: 'get',
		headers: {
			apikey: 'usercenter'
		}
  });
}

/**
 * 根据关键字，搜索用户
 * @param {object} data 查询参数
 */
export function getUser(data) {
  const query = genQuery(data);
  return request({
    url: `/userCenter/getUser?${query}`,
    method: 'get',
		headers: {
			apikey: 'usercenter'
		}
  });
}

/**
 * 新增朋友
 * @param {object} data 当前用户UID、朋友的UID
 */
export function addFriend(data) {
  return request({
    url: '/userCenter/addFriend',
    method: 'post',
    data: data,
		headers: {
			apikey: 'usercenter'
		}
  });
}
