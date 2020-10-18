/**
 * 生成指定位数的数字
 * @param {Number} length 
 */
export function genRandomNum(length = 1) {
	return Math.floor(Math.random() * Math.pow(10, length));
}