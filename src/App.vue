<template>
  <v-app>
    <!-- 顶部导航条 -->
    <NavBar />

    <!-- 主内容区 -->
    <v-main class="main">
      <!-- 给应用提供合适的间距 -->
      <!-- <v-container fluid> -->
      <!-- 如果使用 vue-router -->
      <router-view></router-view>
      <!-- </v-container> -->
    </v-main>

    <!-- 底部播放器 -->
    <!-- <v-footer app> -->
    <AudioPlayer />
    <!-- </v-footer> -->
  </v-app>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
export default {
  name: 'App',
  components: {
    NavBar,
    AudioPlayer
  },
  data: () => ({})
}
</script>

<style lang="scss" scoped>
.main {
  margin: 0 16px;
  padding-bottom: 64px !important;
}
</style>
