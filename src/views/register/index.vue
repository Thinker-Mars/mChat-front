<template>
  <div class="register">
		<div class="register-form">
			<a-form-model
				ref="registerForm"
				:model="registerForm"
				:rules="rules"
				:label-col="{ span: 5 }"
        :wrapper-col="{ span: 20 }"
			>
				<a-form-model-item label="昵称" prop="NickName">
					<a-input v-model="registerForm.NickName" />
				</a-form-model-item>
				<a-form-model-item label="密码" prop="Password">
					<a-input v-model="registerForm.Password" />
				</a-form-model-item>
				<a-form-model-item label="确认密码" prop="ConfirmPassword">
					<a-input v-model="registerForm.ConfirmPassword" />
				</a-form-model-item>
				<a-form-model-item label="上传头像">
					<a-upload
						list-type="picture"
						:fileList="fileList"
						:beforeUpload="beforeUpload"
						:accept="acceptImageType.join(',')"
						:customRequest="handleUpload"
					>
						<a-button> <a-icon type="upload" /> 点击上传 </a-button>
					</a-upload>
				</a-form-model-item>
				<a-form-model-item class="register-button">
					<a-button
            type="primary"
						block
						size="large"
            html-type="submit"
						@click="register"
          >
            注册
          </a-button>
				</a-form-model-item>
				<a-form-model-item class="return-login-button">
					<a-button
						type="dashed"
						block
						size="large"
						html-type="submit"
						@click="goLogin"
					>
						返回登录
					</a-button>
				</a-form-model-item>
			</a-form-model>
		</div>
  </div>
</template>

<script>
import { getTmpCredential } from '@/api/user-center';
export default {
	name: 'Register',
	data() {
		return {
			registerForm: {
				NickName: undefined,
				Password: undefined,
				ConfirmPassword: undefined
			},
			/**
			 * 接受的图片类型
			 */
			acceptImageType: ['image/jpeg', 'image/png'],
			/**
			 * 图片大小限制 5M
			 */
			acceptImageSize: 5,
			/**
			 * 已上传的图片列表
			 */
			fileList: [],
			/**
			 * 临时图片在COS中的folder名
			 */
			folder: 'register-image',
			rules: {
				NickName: [
					{ required: true, message: '请输入昵称', trigger: 'blur' }
				],
				Password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				],
				ConfirmPassword: [
					{ required: true, message: '请再次输入密码', trigger: 'blur' }
				]
			}
		};
	},
	methods: {
		beforeUpload(file, fileList) {
			const data = { folder: this.folder };
			getTmpCredential(data).then(
				(res) => {
					const { code } = res;
					if (code === 1) {
						// 成功获取临时密钥，执行上传
					}
				}
			);
			const checkResult = this.check(file);
			if (!checkResult) {
				return false;
			}
			console.log(file);
			console.log(fileList);
			return true;
		},
		/**
		 * 判断图片是否合法
		 * @param {File} file
		 */
		check(file) {
			const { size, type } = file;
			const validType = this.checkType(type);
			const validSize = this.checkSize(size);
			if (!validType) {
				const message = '无效的图片类型';
				const description = `图片类型目前支持${this.acceptImageType.join('、')}`;
				this.errorTip(message, description);
				return false;
			}
			if (!validSize) {
				const message = '无效的图片大小';
				const description = `上传的图片大小要求在 ${this.acceptImageSize}M 以内`;
				this.errorTip(message, description);
				return false;
			}
			return true;
		},
		/**
		 * 判断图片类型是否合法
		 * @param {string} type 图片类型
		 */
		checkType(type) {
			return this.acceptImageType.includes(type);
		},
		/**
		 * 判断图片大小是否合法
		 * @param {number} size
		 */
		checkSize(size) {
			return size <= (this.acceptImageSize * 1024 * 1024);
		},
		/**
		 * 自定义图片上传
		 */
		handleUpload() {

		},
		/**
		 * 注册
		 */
		register() {

		},
		/**
		 * 前往登录
		 */
		goLogin() {
			this.$router.push({ path: '/' });
		},
		/**
		 * 错误提示
		 * @param {string} message 提示title
		 * @param {string} description 提示内容
		 */
		errorTip(message, description) {
			this.$Notification.open({
				message,
				description,
				icon: <a-icon type="exclamation-circle" style="color: #DC143C" />
			});
		}
	}
};
</script>

<style lang="scss">
.register {
	position: relative;
	width: 100%;
	height: 100%;
}
.register-form {
	width: 50%;
  margin: 0 auto;
	.ant-form-item-label {
		width: 20%;
	}
	.ant-form-item-control-wrapper {
		width: 80%;
	}
	.register-button {
		display: inline-block;
		width: 70%;
		margin-right: 10px;
		.ant-form-item-control-wrapper {
			width: 100%;
		}
	}
	.return-login-button {
		display: inline-block;
    width: calc(30% - 10px);
		.ant-form-item-control-wrapper {
			width: 100%;
		}
	}
}
</style>
