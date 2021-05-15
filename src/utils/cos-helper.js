const COS = require('cos-js-sdk-v5');

function putObject(secure) {
  const cos = new COS({
    getAuthorization: function(options, callback) {
      callback({
        TmpSecretId: secure.credentials.tmpSecretId,
        TmpSecretKey: secure.credentials.tmpSecretKey,
        XCosSecurityToken: secure.credentials.sessionToken,
        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
        StartTime: secure.startTime, // 时间戳，单位秒，如：1580000000
        ExpiredTime: secure.expiredTime // 时间戳，单位秒，如：1580000900
      });
    }
  });
}

module.exports.putObject = putObject;
