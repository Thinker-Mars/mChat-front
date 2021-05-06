import request from '../utils/request';

/**
 * 获取离线消息
 * @param {string} queue
 */
 export function getOfflineMsg(queue) {
	return request({
    url: `/msgCenter/pull?queue=${queue}`,
    method: 'get',
		headers: {
			apikey: 'msgcenter'
		}
  });
}
