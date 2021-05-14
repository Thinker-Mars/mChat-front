<template>
  <div class="register">
		<div class="register-form">
			<a-form
        :form="registerForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
        @submit="handleSubmit"
      >
				<a-form-item label="昵称">
          <a-input v-decorator="['NickName', { rules: [{ required: true, message: '请输入昵称'}] }]" />
        </a-form-item>
				<a-form-item label="密码">
          <a-input v-decorator="['Password', { rules: [{ required: true, message: '请输入密码'}] }]" />
        </a-form-item>
				<a-form-item label="确认密码">
          <a-input v-decorator="['ConfirmPassword', { rules: [{ required: true, message: '请再次输入密码'}] }]" />
        </a-form-item>
				<a-form-item label="上传头像">
					<a-upload
						list-type="picture"
					>
					<a-button> <a-icon type="upload" /> 点击上传 </a-button>
					</a-upload>
        </a-form-item>
				<a-form-item class="">
          <a-button
            type="primary"
						block
            html-type="submit"
          >
            注册
          </a-button>
        </a-form-item>
			</a-form>
		</div>
  </div>
</template>

<script>
export default {
	name: 'Register',
	data() {
		return {
			registerForm: this.$form.createForm(this)
		};
	},
	methods: {
		handleSubmit() {
			console.log(1);
		}
	}
};
</script>

<style scoped lang="scss">

</style>
