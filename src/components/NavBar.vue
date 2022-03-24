<template>
  <div id="nav-bar">
    <!-- 侧边导航抽屉 -->
    <v-navigation-drawer v-model="drawer" app class="drawer">
      <div class="user" @click="handleUser">
        <div class="avatar">
          <img :src="userinfo.picurl ? userinfo.picurl : require('../assets/user.jpeg')" alt="" />
        </div>
        <div class="name" v-if="!userinfo.name">
          立即登录
          <v-icon color="#000">mdi-chevron-right</v-icon>
        </div>
        <div class="name" v-else>
          {{ userinfo.name }}
        </div>
      </div>
      <div class="logout" @click="logout" v-if="userinfo.name">退出登录</div>
    </v-navigation-drawer>

    <!-- 顶部导航栏 -->
    <v-app-bar class="app-bar" :color="bgcolor ? bgcolor : 'rgba(255, 255, 255, 0.95)'" flat app>
      <!-- 首页搜索条 -->
      <v-app-bar-nav-icon v-if="type === 'home'" color="#2f2f2f" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <div v-if="type === 'home'" class="search-container" @click="handleSearch">
        <v-icon size="18" color="#959595">mdi-magnify</v-icon>
        <span>搜索歌曲</span>
      </div>
      <!-- 搜索页 -->
      <div v-else-if="type === 'search'" class="search-detail-container">
        <div class="head">
          <v-icon class="icon" :color="white ? '#fff' : '#2f2f2f'" @click="handleBack">mdi-arrow-left</v-icon>
          <input type="text" v-model="mySearchWord" @keyup="handleSuggest" @keyup.enter="handleSearchWord" />
          <v-btn class="close" icon plain @click="handleClear" v-show="mySearchWord !== ''">
            <v-icon size="22">mdi-close</v-icon>
          </v-btn>
        </div>
      </div>
      <!-- 其他 -->
      <div v-else class="other-container">
        <div class="head">
          <v-icon class="icon" :color="white ? '#fff' : '#2f2f2f'" @click="handleBack">mdi-arrow-left</v-icon>
          <v-toolbar-title class="title" :class="{ fontwhite: white }">{{ name }}</v-toolbar-title>
        </div>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  props: ['type', 'name', 'bgcolor', 'white', 'searchWord'],
  data() {
    return {
      drawer: null,
      mySearchWord: '',
      picurl: require('@/assets/user.jpeg')
    }
  },
  methods: {
    async logout() {
      this.$store.dispatch('logout')
    },
    handleUser() {
      if (!this.userinfo.islogin) {
        this.$router.push('/login')
      }
    },
    handleSearch() {
      this.$router.push('/search')
    },
    handleSearchWord() {
      this.$emit('searchWord', this.mySearchWord)
    },
    handleSuggest() {
      this.$emit('suggest', this.mySearchWord)
    },
    // 返回
    handleBack() {
      this.$router.back()
    },
    handleClear() {
      this.mySearchWord = ''
      this.handleSearchWord()
    }
  },
  watch: {
    searchWord() {
      this.mySearchWord = this.searchWord
    }
  },
  computed: {
    userinfo() {
      return this.$store.state.userinfo
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer {
  padding: 15px;
  .user {
    display: flex;
    align-items: center;
    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .name {
      display: flex;
      align-items: center;
      padding-left: 10px;
      font-size: 14px;
    }
  }
  .logout {
    width: calc(100% - 30px);
    box-shadow: 0px 1px 5px #eee;
    color: #dd2b21;
    border-radius: 10px;
    position: fixed;
    height: 40px;
    line-height: 40px;
    bottom: 15px;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
  }
}
.search-container {
  background-color: #f8f8f8;
  border-radius: 20px;
  padding: 0 10px;
  height: 33px;
  line-height: 33px;
  font-size: 14px;
  width: 100%;
  color: #959595;

  span {
    margin-left: 5px;
  }
}

.search-detail-container {
  display: flex;
  width: 100vw;

  input {
    font-size: 15px;
    margin-left: 10px;
    padding-right: 18px;
    width: 80vw;
    outline: none;
    border-bottom: 1px solid #989898;
    caret-color: #c4403e;
  }
  .close {
    position: absolute;
    right: 2.5vw;
    top: 5px;
  }
}

.other-container {
  .head {
    display: flex;
    .title {
      margin-left: 14px;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
    }
    .icon {
      margin-top: 4px;
      width: 24px;
      height: 24px;
    }
    .fontwhite {
      background: rgba(255, 255, 255, 0);
      color: #fff;
    }
  }
}
</style>
