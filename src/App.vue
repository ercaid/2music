<template>
  <v-app>
    <!-- 主内容区 -->
    <div class="main">
      <router-view></router-view>
    </div>

    <!-- 底部播放器 -->
    <AudioPlayer />
  </v-app>
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer.vue'
export default {
  name: 'App',
  components: {
    AudioPlayer
  },
  data: () => ({})
}
</script>

<style lang="scss" scoped>
.main {
  margin: 0 16px;
  margin-top: 56px;
  padding-bottom: 64px;
}
</style>
