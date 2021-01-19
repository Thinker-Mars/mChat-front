// db 相关常量设置

/**
 * 数据库名称
 */
export const DATABASE_NAME = "mChat";

/**
 * 数据库版本
 */
export const VERSION = 1;

/**
 * 数据表名称集合
 */
export const TABLE_LIST = {
	/**
	 * 记录系统配置
	 */
	// App: "app",
	/**
	 * 记录个人信息
	 */
	UserInfo: "userinfo",
	/**
	 * 记录好友的信息
	 */
	FriendInfo: "friendinfo",
	/**
	 * [消息页]左侧-预览消息列表信息
	 */
	PreviewList: "previewlist"
}