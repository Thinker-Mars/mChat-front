import { DATABASE_NAME, VERSION, TABLE_LIST } from "@/utils/constants/db-constant";
import Tables from "@/utils/db/pojo/index";

/**
 * 获取数据库对象
 * 仅供内部方法使用，不对外暴露
 * @param {string} dbName 数据库名称
 * @param {number} version 数据库版本
 */
export function getDB(dbName, version) {
	return new Promise(function(resolve, reject) {
		let request = window.indexedDB.open(dbName, version);
		request.onsuccess = function(e) {
			const db = e.target.result;
			resolve(db);
		}
	})
}

/**
 * 初始化数据库
 */
export function initDB() {
	return new Promise(function(resolve, reject) {
		let request = window.indexedDB.open(DATABASE_NAME, VERSION);
		request.onupgradeneeded = function(e) {
			const db = e.target.result;
			for (let tableName in TABLE_LIST) {
				if (!db.objectStoreNames.contains(tableName)) {
					let table = Tables[tableName];
					let objectStore = db.createObjectStore(tableName, {autoIncrement: true});
					for (let column in table) {
						objectStore.createIndex(column, column, {unique: table[column].unique});
					}
				}
			}
			resolve(db);
		}
	});
}

/**
 * 创建与朋友的聊天记录数据表
 * @param {number} version 当前数据库版本号
 * @param {number} uid 朋友的uid
 */
export function createChatTable(version, uid) {
	return new Promise(function(resolve, reject) {
		const tableName = `${uid}-chat`;
		let request = window.indexedDB.open(DATABASE_NAME, version + 1);
		request.onupgradeneeded = function(e) {
			const db = e.target.result;
			let objectStore = db.createObjectStore(tableName, {autoIncrement: true});
			for (let column in Tables.Chat) {
				objectStore.createIndex(column, column, {unique: false});
			}
			resolve(db);
		}
	})
}

/**
 * 判断数据库中是否有某张表
 * @param {string} tableName 数据表名
 * @param {IDBDatabase} db 数据库
 */
export function existTable(tableName, db) {
	return db.objectStoreNames.contains(tableName);
}

/**
 * 向 [db]--[tableName]中新增一条记录[data]
 * @param {IDBDatabase} db
 * @param {string} tableName 存储的表名称
 * @param {object} data 记录
 */
export function addRecord(db, tableName, data) {
	return new Promise(function(resolve, reject) {
		let request = db.transaction(tableName, "readwrite")
		.objectStore(tableName)
		.add(data);
		request.onsuccess = function() {
			resolve({
				code: 1000
			});
		};
		request.onerror = function(e) {
			reject({
				code: 0,
				msg: e.target.error
			})
		}
	})
}

/**
 * 获取某张表中的数据量
 * @param {IDBDatabase} db 
 * @param {string} tableName 
 */
export function countTableMsg(db, tableName) {
	return new Promise(function(resolve, reject) {
		let request = db.transaction(tableName, "readonly")
		.objectStore(tableName)
		.count();
		request.onsuccess = function(e) {
			resolve({
				code: 1000,
				data: e.target.result
			});
		}
	})
}

/**
 * 
 * @param {IDBDatabase} db 
 * @param {string} tableName 
 * @param {number} upper 
 * @param {number} count 
 */
export function getHisMsg(db, tableName, upper, count = 20) {
	return new Promise(function(resolve, reject) {
		const lower = (upper - count) > 0 ? (upper - count) : 0;
		const keyRange = IDBKeyRange.bound(lower, upper);
		let records = [];
		let request = db.transaction(tableName, "readonly")
		.objectStore(tableName)
		.openCursor(keyRange);
		request.onsuccess = function(e) {
			let cursor = e.target.result;
			if (cursor) {
				records.push(cursor.value);
				cursor.continue();
			} else {
				resolve({
					code: 1000,
					data: records
				})
			}
		}
	})
}