import request from '../utils/request';

export function connect() {
	return request({
		url: '/connect',
		method: 'get'
	});
};
