const COS = require('cos-js-sdk-v5');

/**
 * 临时桶名
 */
const TempBucket = 'mchat-tmp-1259375888';

/**
 * 存储桶所在地域
 */
const Region = 'ap-nanjing';

export function putTempObject(secure, key, file) {
  return new Promise((resolve, reject) => {
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
    cos.putObject(
      {
        Bucket: TempBucket,
        Region: Region,
        Key: key,
        Body: file
      },
      function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}
