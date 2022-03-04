<template>
  <div class="home-container">
    <!-- 顶部导航条 -->
    <NavBar type="home" />
    <v-carousel cycle v-model="model" class="banner" :show-arrows="false" delimiter-icon="mdi-minus" hide-delimiter-background hide-delimiters>
      <v-carousel-item v-for="(item, index) in banners" :key="index">
        <img :src="item.pic" alt="" />
      </v-carousel-item>
    </v-carousel>
    <router-link to="/rank">排行榜</router-link>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import { banner } from '@/common/neteaseApi.js'
export default {
  name: 'HomeView',
  components: {
    NavBar
  },
  data() {
    return {
      banners: [],
      model: 0
    }
  },
  async created() {
    const res = await banner()
    if (res.data.code === 200) {
      this.banners = res.data.banners
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  margin: 0 16px;
  margin-top: 60px;
  padding-bottom: 64px;

  .banner {
    margin: 0 auto;
    // width: 345px;
    height: 133px !important;

    img {
      width: 100%;
      height: 133px;
    }
  }
}
</style>
