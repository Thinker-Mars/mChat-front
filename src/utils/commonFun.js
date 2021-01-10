/**
 * 生成指定位数的数字
 * @param {number} length 
 */
export function genRandomNum(length = 1) {
	return Math.floor(Math.random() * Math.pow(10, length));
}

/**
 * 根据时间戳与策略返回预览的时间
 * @param {number} timestamp 时间戳
 */
export function tellTime(timestamp) {
	let time = new Date(timestamp);
	let year = (new Date()).getFullYear();
	let month = time.getMonth() + 1;
	let day = time.getDate();
	let hour = time.getHours();
	let minutes = time.getMinutes();
	let currentTimestamp = (new Date()).getTime();
	const oneDay = 86400000;
	return hour + ":" + minutes;
}