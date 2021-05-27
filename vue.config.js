// const path = require('path');

// function resolve(dir) {
// 	return path.join(__dirname, dir);
// }

const port = process.env.PORT;

module.exports = {
	devServer: {
		host: '0.0.0.0',
		port: port, // 指定端口号监听请求
		hot: true, // 启用 Hot Module Replacement 功能
		proxy: {
			[process.env.PROXY_API]: {
				target: 'http://47.92.82.34:9080/',
				// target: 'http://127.0.0.1:2000/',
				changeOrigin: true, // 默认情况下，代理时会保留主机头的来源，可以将 changeOrigin 设置为 true 以覆盖此行为
				secure: false, // 代理http
				ws: true,
				pathRewrite: { ['^' + process.env.PROXY_API]: '' }
			}
		},
		disableHostCheck: true // 跳过host检查
	},
	pluginOptions: {
		builderOptions: {
			productName: 'mChat',
			nsis: {
				oneClick: false
			}
		}
	}
};
