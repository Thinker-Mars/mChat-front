const { publicEncrypt } = require('crypto');

/**
 * 生成指定位数的数字
 * @param {number} length
 */
export function genRandomNum(length = 1) {
  return Math.floor(Math.random() * Math.pow(10, length));
}

/**
 * 根据时间戳与显示模式返回要显示的时间
 * @param {number} timestamp
 * @param {number} mode 使用场景，1:消息预览列表 2:聊天窗口
 */
export function tellTime(timestamp, mode = 1) {
  const diffTimestamp = (new Date()).getTime() - timestamp;
  const time = new Date(timestamp);
  const year = (new Date()).getFullYear(); // 年
  const month = time.getMonth() + 1; // 月
  const day = time.getDate(); // 日
  const hour = time.getHours(); // 时
  const minutes = time.getMinutes(); // 分
  const showMinutes = minutes >= 10 ? minutes : '0' + minutes;
  const oneDay = 86400000; // 一天的时间(ms)
  if (mode === 1) {
    if (diffTimestamp < oneDay) {
      return `${hour}:${showMinutes}`;
    }
    if (diffTimestamp >= oneDay && diffTimestamp < oneDay * 2) {
      return '昨天';
    }
    return `${year}/${month}/${day}`;
  }
  if (mode === 2) {
    if (diffTimestamp < oneDay) {
      return `${hour}:${showMinutes}`;
    }
    if (diffTimestamp >= oneDay && diffTimestamp < oneDay * 2) {
      return `昨天 ${hour}:${showMinutes}`;
    }
    return `${year}年 ${month}月${day}日 ${hour}:${showMinutes}`;
  }
}

/**
 * 非对称加密
 * @param {string} content 要加密的内容
 * @param {string} publicKey 公钥
 * @returns 加密后的内容
 */
export function encrypt(content, publicKey) {
  return publicEncrypt(publicKey, Buffer.from(content)).toString('base64');
}
