import request from '../utils/request';

export function sendMsg(data) {
	return request({
		url: '/send',
		method: 'post',
		data: data
	});
};
