<template>
  <div id="nav-bar">
    <!-- 侧边导航抽屉 -->
    <v-navigation-drawer v-model="drawer" app>
      <!--  -->
    </v-navigation-drawer>

    <!-- 顶部导航栏 -->
    <v-app-bar class="app-bar" :color="bgcolor ? bgcolor : 'rgba(255, 255, 255, 0.95)'" flat app>
      <!-- 首页搜索条 -->
      <v-app-bar-nav-icon v-if="type === 'home'" color="#2f2f2f" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <div v-if="type === 'home'" class="search-container" @click="handleSearch">
        <v-icon size="18" color="#959595">mdi-magnify</v-icon>
        <span>搜索歌曲</span>
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
  props: ['type', 'name', 'bgcolor', 'white'],
  data() {
    return {
      drawer: null
    }
  },
  methods: {
    handleSearch() {},
    // 返回
    handleBack() {
      this.$router.back()
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
