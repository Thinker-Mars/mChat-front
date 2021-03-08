<template>
  <div class="login">
    <img src="@/assets/login-bg/1.jpg">
    <div class="login-form">
      <a-form
        :form="loginForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
        @submit="handleSubmit"
      >
        <a-form-item label="手机号">
          <a-input v-decorator="['identify', { rules: [{ required: true, message: '请输入账号'}] }]" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input
            v-decorator="['pwd', { rules: [{ required: true, message: '请输入密码'}] }]"
            type="password"
          />
        </a-form-item>
        <a-form-item class="login-btn">
          <a-button
            type="primary"
            html-type="submit"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: this.$form.createForm(this)
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      const that = this;
      that.loginForm.validateFields((err, values) => {
        if (!err) {
          // 建立socket连接，初始化监听
          that.$store.dispatch('socket/connect').then(() => {
            that.$router.push({ path: '/home/chat' });
          });
          // that.$router.push({path: "/home/chat"});
        }
      });
    }
  }
};
</script>

<style lang="scss">
	.login {
		width: 100%;
		height: 100%;
		position: relative;
		img {
			width: 100%;
			height: 100%;
		}

		.login-form {
			padding: 24px 24px 24px 30px;
			width: 348px;
			margin: 0 auto;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			border-radius: 4px;
			box-shadow: 0 1px 3px rgba(26,26,26,0.1);
			background-color: #FFFFFF;
			.ant-form {
				width: 300px;
				text-align: center;
				.login-btn {
					margin-bottom: 0;
					.ant-col-16 {
						width: unset;
					}
					.ant-col {
						text-align: center;
						.ant-form-item-control {
							display: inline-block;
							.ant-form-item-children {
								.ant-btn {
									width: 264px;
								}
							}
						}
					}
				}
			}

		}
	}
</style>
