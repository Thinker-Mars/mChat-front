import { DATABASE_NAME, TABLE_LIST, DB_VERSION_IDENTIFY } from '@/utils/constants/db-constant';
import Tables from '@/utils/db/pojo/index';

/**
 * 获取数据库对象
 * @param {string} dbName 数据库名称
 * @param {number} version 数据库版本
 */
function getDB(dbName, version) {
  return new Promise(function(resolve, reject) {
    const request = window.indexedDB.open(dbName, version);
    // 返回已有数据库
    request.onsuccess = function(e) {
      const db = e.target.result;
      resolve(db);
    };
		request.onerror = function(e) {
			reject(e.target.error);
		};
  });
}

/**
 * 获取db版本
 * 如果用户第一次使用则返回1
 */
function getLocalDBVersion() {
  const dbVersion = Number(localStorage.getItem(DB_VERSION_IDENTIFY));
  if (dbVersion > 0) {
    return dbVersion;
  }
  return 1;
}

/**
 * 更新localStorage中的数据库版本
 */
function updateLocalDBVersion(dbVersion) {
  localStorage.setItem(DB_VERSION_IDENTIFY, dbVersion);
}

/**
 * 删除 localStorage 中 dbversion 的值
 */
 function removeLocalDBVersion() {
	localStorage.removeItem(DB_VERSION_IDENTIFY);
}

/**
 * 初始化数据库
 */
export function initDB(dbName) {
	return new Promise((resolve, reject) => {
		const dbVersion = getLocalDBVersion();
		const request = window.indexedDB.open(dbName, dbVersion);
		request.onupgradeneeded = function(e) {
			updateLocalDBVersion(dbVersion);
			const db = e.target.result;
			for (const tableName in TABLE_LIST) {
				if (!db.objectStoreNames.contains(tableName)) {
					const table = Tables[tableName];
					const optionalParameters = {};
					if (table.keyPath) {
						optionalParameters['keyPath'] = table.keyPath;
					}
					if (table.autoIncrement) {
						optionalParameters['autoIncrement'] = table.autoIncrement;
					}
					const objectStore = db.createObjectStore(tableName, optionalParameters);
					for (const column in table.columns) {
						objectStore.createIndex(column, column, { unique: table.columns[column].unique });
					}
				}
			}
			db.close();
			resolve();
		};
		request.onsuccess = function() {
			resolve();
		};
	});
}

/**
 * 创建与朋友的聊天记录数据表
 * @param {string} tableName 表名
 * tableName: ${uid}-chat
 */
export function createChatTable(tableName) {
	return new Promise((resolve, reject) => {
		// 当前数据库版本号
		const oldversion = getLocalDBVersion();
		const request = window.indexedDB.open(DATABASE_NAME, oldversion + 1);
		request.onupgradeneeded = function(e) {
			updateLocalDBVersion(oldversion + 1);
			const db = e.target.result;
			const table = Tables['Chat'];
			const optionalParameters = {};
			if (table.keyPath) {
				optionalParameters['keyPath'] = table.keyPath;
			}
			if (table.autoIncrement) {
				optionalParameters['autoIncrement'] = table.autoIncrement;
			}
			const objectStore = db.createObjectStore(tableName, optionalParameters);
			for (const column in table.columns) {
				objectStore.createIndex(column, column, { unique: table.columns[column].unique });
			}
			db.close();
			resolve();
		};
	});
}

/**
 * 判断数据库中是否有某张表
 * @param {string} tableName 数据表名
 */
export function existTable(tableName) {
	return new Promise((resolve, reject) => {
		const dbVersion = getLocalDBVersion();
		getDB(DATABASE_NAME, dbVersion).then(
			(db) => {
				const have = db.objectStoreNames.contains(tableName);
				db.close();
				resolve(have);
			}
		);
	});
}

/**
 * 向 [tableName]中新增一条记录[data]
 * @param {string} tableName 存储的表名称
 * @param {object} data 记录
 */
export function addRecord(tableName, data) {
  return new Promise(function(resolve, reject) {
		const dbVersion = getLocalDBVersion();
		getDB(DATABASE_NAME, dbVersion).then(
			(db) => {
				const request = db.transaction(tableName, 'readwrite')
				.objectStore(tableName)
				.add(data);
				request.onsuccess = function() {
					db.close();
					resolve({
						code: 1000
					});
				};
				request.onerror = function(e) {
					db.close();
					reject({
						code: 0,
						msg: e.target.error
					});
				};
			}
		);
  });
}

/**
 * 清空指定的表中的数据
 * @param {string} tableName 存储的表名称
 */
export function truncateTable(tableName) {
	return new Promise((resolve, reject) => {
		const dbVersion = getLocalDBVersion();
		getDB(DATABASE_NAME, dbVersion).then(
			(db) => {
				const request = db.transaction(tableName, 'readwrite')
				.objectStore(tableName)
				.clear();
				request.onsuccess = function() {
					db.close();
					resolve({
						code: 1000
					});
				};
			}
		);
	});
}

/**
 * 批量新增数据
 * @param {string} tableName 存储的表名称
 * @param {array} data 要新增的数据
 * @param {Map<string, array>} msgMap
 * msgMap的entry格式如下：
 * tableName: [
 *  {data}, {data}...
 * ]
 */
export function patchAddRecord(msgMap) {
	const dbVersion = getLocalDBVersion();
	getDB(DATABASE_NAME, dbVersion).then(
		(db) => {
			const msgIterator = msgMap.entries();
			let currentMsgGroup = msgIterator.next().value;
			while (currentMsgGroup) {
				const tableName = currentMsgGroup[0];
				const messages = currentMsgGroup[1];
				if (messages.length > 0) {
					messages.forEach(async(data) => {
						await addRecordAsync(db, tableName, data);
					});
				}
				currentMsgGroup = msgIterator.next().value;
			}
		},
		(err) => {
			console.log(err);
		}
	);
}

/**
 * 内部插入数据方法
 * @param {IDBDatabase} db
 * @param {string} tableName
 * @param {object} data
 */
function addRecordAsync(db, tableName, data) {
	return new Promise((resolve, reject) => {
		const request = db.transaction(tableName, 'readwrite')
				.objectStore(tableName)
				.add(data);
		request.onsuccess = function() {
			resolve();
		};
		request.onerror = function() {
			reject();
		};
	});
}

/**
 * 获取某张表中的数据量
 * @param {string} tableName
 */
export function countTableMsg(tableName) {
  return new Promise(function(resolve, reject) {
		const dbVersion = getLocalDBVersion();
		getDB(DATABASE_NAME, dbVersion).then(
			(db) => {
				const request = db.transaction(tableName, 'readonly')
				.objectStore(tableName)
				.count();
				request.onsuccess = function(e) {
					db.close();
					resolve({
						code: 1000,
						data: e.target.result
					});
				};
			}
		);
  });
}

/**
 * 获取 [db]-[tableName]下索引在[upper]前的[count]条记录
 * @param {string} tableName 数据表名称
 * @param {string} mode all: 全部数据 range: 指定边界
 * @param {number} upper 右边界
 * @param {number} count 数量(默认20条)
 */
export function getHisMsg(tableName, mode, upper, count = 20) {
  return new Promise(function(resolve, reject) {
		const dbVersion = getLocalDBVersion();
		getDB(DATABASE_NAME, dbVersion).then(
			(db) => {
				let request;
				const records = [];
				if (mode === 'all') {
					request = db.transaction(tableName, 'readonly')
					.objectStore(tableName)
					.openCursor();
				} else if (mode === 'range') {
					const lower = (upper - count) > 0 ? (upper - count) : 0;
					// 左开右闭区间，即不包含左端点
					const keyRange = IDBKeyRange.bound(lower, upper, true, false);
					request = db.transaction(tableName, 'readonly')
					.objectStore(tableName)
					.openCursor(keyRange);
				} else {
					db.close();
					resolve({
						code: 1000,
						data: records
					});
					return;
				}
				request.onsuccess = function(e) {
					const cursor = e.target.result;
					if (cursor) {
						records.push(cursor.value);
						cursor.continue();
					} else {
						db.close();
						resolve({
							code: 1000,
							data: records
						});
					}
				};
			}
		);
  });
}

/**
 * 删除 [db]-[tableName]下时间戳为[timeStamp]的某条聊天记录
 * 适用于聊天记录的删除
 * @param {string} tableName
 * @param {number} timeStamp
 */
export function deleteDBRecord(tableName, timeStamp) {
  return new Promise(function(resolve, reject) {
		const dbVersion = getLocalDBVersion();
		getDB(DATABASE_NAME, dbVersion).then(
			(db) => {
				const request = db.transaction(tableName, 'readwrite')
				.objectStore(tableName)
				.delete(timeStamp);
				request.onsuccess = function() {
					db.close();
					resolve({
						code: 1000
					});
				};
			}
		);
  });
}

/**
 * 获取 [tableName]下，主键为 [key] 的某条记录
 * @param {string} tableName
 * @param {string} key
 */
export function getDataByKey(tableName, key) {
	return new Promise((resolve, reject) => {
		const dbVersion = getLocalDBVersion();
		getDB(DATABASE_NAME, dbVersion).then(
			(db) => {
				const request = db.transaction(tableName)
				.objectStore(tableName)
				.get(key);
				request.onsuccess = function(e) {
					db.close();
					resolve({
						code: 1000,
						data: e.target.result
					});
				};
			}
		);
	});
}

/**
 * 删除数据库
 * @param {string} name 数据库名称
 */
export async function dropDatabase(name) {
	return new Promise((resolve, reject) => {
		const request = window.indexedDB.deleteDatabase(name);
		removeLocalDBVersion();
		request.onsuccess = function() {
			resolve();
		};
	});
}
