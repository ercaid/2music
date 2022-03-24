<template>
  <v-app>
    <!-- 主内容区 -->
    <div class="main">
      <keep-alive include="HomeView,RankView,DailyView">
        <router-view></router-view>
      </keep-alive>
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
  }
}
</script>

<style lang="scss">
// 公共样式
.bg {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center 0;
  overflow: hidden;
  z-index: 0;
}
.bg:after {
  content: '';
  width: 120%;
  height: 120%;
  position: absolute;
  left: -10%;
  top: -10%;
  /* 从父元素继承 background 属性的设置 */
  background: inherit;
  filter: blur(20px);
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
