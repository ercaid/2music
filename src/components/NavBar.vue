<template>
  <div id="nav-bar">
    <!-- 侧边导航抽屉 -->
    <v-navigation-drawer v-model="drawer" app>
      <!--  -->
    </v-navigation-drawer>

    <!-- 顶部导航栏 -->
    <v-app-bar color="rgba(255, 255, 255, 0.95)" :flat="true" app>
      <!-- 首页搜索条 -->
      <v-app-bar-nav-icon v-if="path === '/'" color="#2f2f2f" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <div v-if="path === '/'" class="search-container" @click="handleSearch">
        <v-icon size="18" color="#959595">mdi-magnify</v-icon>
        <span>搜索歌曲</span>
      </div>
      <!-- 排行榜 -->
      <div v-else-if="path === '/rank'" class="rank-container">
        <div class="head">
          <v-icon color="#2f2f2f" @click="handleBack">mdi-arrow-left</v-icon>
          <v-toolbar-title class="title">排行榜</v-toolbar-title>
        </div>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
// import '@/assets/iconfont/iconfont.css'
export default {
  data() {
    return {
      drawer: null,
      path: null
    }
  },
  methods: {
    handleSearch() {},
    // 返回
    handleBack() {
      this.$router.back()
    }
  },
  watch: {
    // 监听路由变化
    $route(to, from) {
      this.path = to.path
    }
  }
}
</script>

<style lang="scss" scoped>
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

.rank-container {
  .head {
    display: flex;
    .title {
      margin-left: 14px;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
    }
  }
}
</style>
