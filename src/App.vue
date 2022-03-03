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

<style lang="scss">
// .main {
//   margin: 0 16px;
//   margin-top: 56px;
//   padding-bottom: 64px;
// }
// 公共样式
.bg {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center 0;
  // filter: blur(20px);
  // transform: scale(1.2);
  overflow: hidden;
  z-index: 0;
}
.bg:after {
  content: '';
  width: 110%;
  height: 110%;
  position: absolute;
  left: -5%;
  top: -5%;
  /* 从父元素继承 background 属性的设置 */
  background: inherit;
  filter: blur(20px);
}
</style>
