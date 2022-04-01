<template>
  <div class="login-container">
    <div class="back" @click="back">立即体验</div>
    <v-text-field label="手机号" color="#dd2b1f" class="input" v-model="userinfo.phone" required></v-text-field>
    <v-text-field label="密码" color="#dd2b1f" class="input" type="password" v-model="userinfo.password" required></v-text-field>
    <div class="button" @click="login">登录</div>
    <div class="hint" v-if="err">登录失败</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userinfo: {
        phone: null,
        password: null
      },
      err: false
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    async login() {
      if (this.userinfo.phone && this.userinfo.password) {
        this.$store.dispatch('login', this.userinfo).catch(() => {
          this.err = true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 250px 16px 64px 16px;

  .back {
    position: fixed;
    top: 10px;
    right: 20px;
    font-size: 14px;
    color: rgba(221, 43, 33, 0.6);
  }

  .button {
    width: 90%;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    background-color: #dd2b21;
    margin-top: 30px;
    font-size: 15px;
    font-weight: 500;
    color: #fff;
    text-align: center;
  }
  .input {
    width: 90%;
  }

  .hint {
    margin-top: 20px;
    color: rgba(221, 43, 33, 0.6);
  }
}
</style>
