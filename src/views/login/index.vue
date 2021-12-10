<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div align="center" class="title-container">
        <h3 class="title">考试管理系统</h3>
      </div>
      <el-form-item prop="account">
        <el-input
          ref="account"
          v-model="loginForm.account"
          placeholder="用户名"
          name="account"
          type="text"
          tabindex="1"
          auto-complete="on"
          prefix-icon="icon-aliyonghu"
          clearable
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
          show-password
          prefix-icon="icon-alimima"
          clearable
        />
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input
          ref="captcha"
          v-model="loginForm.captcha"
          placeholder="验证码"
          style="width: 69%"
          prefix-icon="icon-aliyanzhengma"
          clearable
          />
        <div class="login-code">
          <img :src="codeUrl" @click="getCaptcha" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

    </el-form>
  </div>
</template>

<script>
import { captcha } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      codeUrl: '',
      loginForm: {
        account: 'user1',
        password: '123456',
        captcha: '',
        uuid: ''
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', message: '请填写用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请填写密码' }],
        captcha: [
          { required: true, trigger: 'blur', message: '请填写验证码' },
          { min: 4, max: 4, message: '验证码为四个字符', trigger: 'blur' }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCaptcha()
  },
  methods: {
    getCaptcha() {
      captcha().then(res => {
        this.codeUrl = 'data:image/gif;base64,' + res.data.code
        this.loginForm.uuid = res.data.uuid
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.getCaptcha()
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("../../assets/image/login-background.jpg");
    background-size: cover;
    background-repeat: no-repeat;
  }
  .login-form {
    width: 400px;
    height: auto;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 20px;
  }
  .login-code {
    width: 30%;
    float: right;
    height: 40px;
  }
  .login-code-img {
    width: 100%;
    height: 96%;
  }
</style>
