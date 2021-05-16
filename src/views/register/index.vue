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
					<a-tooltip title="请控制昵称长度不超过 10 位">
						<a-icon type="question-circle" style="margin-left: 10px" />
					</a-tooltip>
				</a-form-model-item>
				<a-form-model-item label="密码" prop="Password">
					<a-input-password v-model="registerForm.Password" :visibilityToggle="false" />
					<a-tooltip title="请控制密码长度在 8 到 14 位之间">
						<a-icon type="question-circle" style="margin-left: 10px" />
					</a-tooltip>
				</a-form-model-item>
				<a-form-model-item label="确认密码" prop="ConfirmPassword">
					<a-input-password v-model="registerForm.ConfirmPassword" :visibilityToggle="false" />
				</a-form-model-item>
				<a-form-model-item label="上传头像">
					<a-upload
						list-type="picture"
						:fileList="fileList"
						:beforeUpload="beforeUpload"
						:accept="acceptImageType.join(',')"
						:customRequest="handleUpload"
						:remove="handleRemove"
					>
						<a-button> <a-icon type="upload" /> 点击上传 </a-button>
						<a-tooltip title="如不上传，则使用如下默认头像">
							<a-icon type="question-circle" style="margin-left: 10px" />
						</a-tooltip>
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
import { register, getTmpCredential, getPublicKey } from '@/api/user-center';
import { putTempObject } from '@/utils/cos-helper';
import { genRandomNum, encrypt } from '@/utils/commonFun';
import { RequestCode } from '@/utils/constants/request-constant';
export default {
	name: 'Register',
	data() {
		const confirmPasswordValidate = (rule, value, callback) => {
			if (value !== this.registerForm.Password) {
				return callback(new Error('密码不一致，请确认'));
			} else {
				callback();
			}
		};
		return {
			/**
			 * 注册表单初始数据
			 */
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
			fileList: [
				{
					uid: genRandomNum(6),
					name: '默认头像',
					status: 'done',
					url: 'https://mchat-tmp-1259375888.cos.ap-nanjing.myqcloud.com/register-image/default.jpg'
				}
			],
			/**
			 * 临时图片在COS中的folder名
			 */
			folder: 'register-image',
			/**
			 * 注册表单校验规则
			 */
			rules: {
				NickName: [
					{ required: true, message: '请输入昵称', trigger: 'blur' },
					{ min: 1, max: 10, message: '昵称长度不应超过10位', trigger: 'blur' }
				],
				Password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 8, max: 14, message: '密码长度为8-14位', trigger: 'blur' }
				],
				ConfirmPassword: [
					{ required: true, message: '请再次输入密码', trigger: 'blur' },
					{ required: true, validator: confirmPasswordValidate, trigger: 'blur' }
				]
			},
			/**
			 * 上传图片的key
			 */
			uploadKey: undefined
		};
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.uploadKey = `${(new Date()).getTime()}-${genRandomNum(6)}`;
		},
		beforeUpload(file) {
			const checkResult = this.check(file);
			if (!checkResult) {
				return false;
			}
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
		handleUpload(uploadData) {
			const { file } = uploadData;
			const data = { folder: this.folder };
			getTmpCredential(data).then(
				(res) => {
					const { code, data } = res;
					if (code === RequestCode.Success) {
						// 文件名
						const filename = file.name;
						// 文件后缀
						const suffix = filename.substring(filename.lastIndexOf('.') + 1);
						// 在COS中的位置
						const key = `${this.folder}/${this.uploadKey}.${suffix}`;
						putTempObject(data, key, file).then(
							(putRes) => {
								this.fileList = [];
								this.fileList.push({
									uid: genRandomNum(6),
									name: filename,
									status: 'done',
									url: `https://${putRes.Location}`
								});
								this.successTip('操作成功', '图片上传成功');
							},
							() => {
								this.errorTip('操作失败', '上传失败，请稍候重试');
							}
						);
					}
				}
			);
		},
		/**
		 * 移除图片
		 */
		handleRemove() {
			this.fileList = [];
			return true;
		},
		/**
		 * 注册
		 */
		register() {
			this.$refs.registerForm.validate((valid) => {
				if (valid) {
					getPublicKey().then(
						(res) => {
							const PublicKey = res.data;
							const { NickName, Password } = this.registerForm;
							const registerData = {
								NickName,
								Password: encrypt(Password, PublicKey),
								Avatar: this.uploadKey,
								PublicKey: PublicKey
							};
							register(registerData).then(
								(regRes) => {
									const that = this;
									const { code, data } = regRes;
									if (code === RequestCode.Success) {
										const { Uid } = data;
										that.$Success({
											title: '注册成功',
											content: `账号注册成功，你的专属UID是：${Uid}，快去登录吧~`,
											okText: '前往登录',
											keyboard: false,
											onOk() {
												that.$router.push({ path: '/' });
											}
										});
									} else {
										that.errorTip('注册失败', '系统繁忙，请稍候再试');
									}
								}
							);
						},
						() => {
							this.errorTip('操作失败', '系统繁忙，请稍候再试');
						}
					);
				}
			});
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
				icon: <a-icon type="close" style="color: #DC143C" />
			});
		},
		/**
		 * 成功提示
		 * @param {string} message 提示title
		 * @param {string} description 提示内容
		 */
		successTip(message, description) {
			this.$Notification.open({
				message,
				description,
				icon: <a-icon type="check" style="color: #2E8B57"/>
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
	input {
		width: calc(100% - 24px);
	}
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
