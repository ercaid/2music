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
  },
  created() {
    // 设置 QQ 音乐 cookie
    document.cookie = 'pgv_pvid=5381718662'
    document.cookie = 'fqm_pvqid=908d7b2d-6ecd-4912-8f7d-d9d4acba5ff7'
    document.cookie = 'fqm_sessionid=3ae9de15-0b63-41c7-b455-5e3441bcf603'
    document.cookie = 'pgv_info=ssid=s246739840'
    document.cookie = 'ts_uid=3860069520'
    document.cookie = 'ts_last=y.qq.com/'
    document.cookie = 'ts_refer=jsososo.github.io/'
    document.cookie = '_qpsvr_localtk=0.8079049408426726'
    document.cookie = 'psrf_qqunionid='
    document.cookie = 'euin=oK6kowEAoK4z7ecA7Kv57w457n**'
    document.cookie = 'wxunionid=oqFLxst0eKPx1R7w6AFOeHefQ4z0'
    document.cookie = 'wxopenid=opCFJw6OM5Vndwe7EeaLKTfHtB54'
    document.cookie = 'psrf_qqaccess_token='
    document.cookie = 'qqmusic_key=W_X_5uWmkMkmJQ38fVJuKyQzaAovg6rejUq0-Wk_GppWmLE9qHSCOiuTbik8gLJBBnFDdlQasDPkMRKM'
    document.cookie = 'tmeLoginType=1'
    document.cookie = 'wxuin=1152921504825416514'
    document.cookie = 'wxrefresh_token=55_hLlOiUbWINomTb4xJ2fBECjXyJbKpXTgnFHNj1BjaFg9H370r83y2jultYhgcS-AkQL4dYixpWHbbsLUuBpxwPspz3Ix7qJFVtL7iYMe6Lk'
    document.cookie = 'qm_keyst=W_X_5uWmkMkmJQ38fVJuKyQzaAovg6rejUq0-Wk_GppWmLE9qHSCOiuTbik8gLJBBnFDdlQasDPkMRKM'
    document.cookie = 'psrf_qqrefresh_token='
    document.cookie = 'login_type=2'
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
