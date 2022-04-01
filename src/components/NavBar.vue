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
      <div class="box">
        <v-dialog v-model="likeListOpen" width="500">
          <template v-slot:activator="{ on, attrs }">
            <div class="item" v-bind="attrs" v-on="on" @click="getLikeList">
              <v-icon color="#ff3a3b" size="18" class="heart">mdi-heart</v-icon>
              <div class="content">我喜欢的音乐</div>
              <v-icon color="#dbdbdb" size="18" class="right">mdi-chevron-right</v-icon>
            </div>
          </template>
          <v-card class="playlist">
            <div class="title">
              喜欢 <span>({{ likeList.length }})</span>
            </div>
            <div class="play-list-item" v-for="(item, index) in likeList" :key="index">
              <div class="name">
                <span>{{ item.name }}</span>
                <span class="artist">
                  -
                  <span v-for="(i, d) in item.ar" :key="d">
                    {{ i.name }}
                    <span v-if="d != item.ar.length - 1">/</span>
                  </span>
                </span>
              </div>
              <div class="delete" @click.stop="handleDelete(index)">
                <v-icon color="#b4b4b4" size="18">mdi-close</v-icon>
              </div>
            </div>
          </v-card>
        </v-dialog>
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
      picurl: require('@/assets/user.jpeg'),
      likeListOpen: false,
      likeList: []
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
    },
    handleDelete(index) {
      this.likeList.splice(index, 1)
      localStorage.setItem('likeList', JSON.stringify(this.likeList))
    },
    getLikeList() {
      // 获取收藏歌曲列表
      this.likeList = JSON.parse(localStorage.getItem('likeList')) || []
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
  background-color: #f6f6f6 !important;
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
  .box {
    .item {
      position: relative;
      display: flex;
      margin-top: 20px;
      background-color: #fff;
      border-radius: 8px;
      height: 50px;
      line-height: 50px;
      padding-left: 18px;
      font-size: 16px;
      .heart {
        margin-right: 11px;
      }
      .right {
        position: absolute;
        right: 16px;
        top: 0;
        bottom: 0;
      }
    }
  }
  .logout {
    width: calc(100% - 30px);
    box-shadow: 0px 1px 5px #eee;
    color: #dd2b21;
    background-color: #fff;
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
::v-deep .v-dialog {
  box-shadow: none;
}
.playlist {
  background-color: #fff;
  border-radius: 25px !important;
  height: 500px;
  padding: 25px 16px;
  overflow: scroll;

  .title {
    margin-bottom: 20px;
    font-size: 18px;

    span {
      font-size: 11px;
      color: #808080;
    }
  }

  .play-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    padding-bottom: 25px;

    .name {
      width: 65vw;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      .artist {
        color: #808080;
        font-size: 10px;
      }
      .icon {
        margin-right: 5px;
      }
    }
  }

  .active {
    color: #fb362e !important;
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
