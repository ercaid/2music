<template>
  <div class="home-container">
    <!-- 顶部导航条 -->
    <NavBar type="home" />
    <v-carousel cycle v-model="model" class="banner" :show-arrows="false" delimiter-icon="mdi-minus" hide-delimiter-background hide-delimiters>
      <v-carousel-item v-for="(item, index) in banners" :key="index">
        <img :src="item.pic" alt="" />
      </v-carousel-item>
    </v-carousel>
    <div class="rank" @click="handleToRank">
      <div class="img">
        <v-icon color="#fd3b41">mdi-triangle-wave</v-icon>
      </div>
      排行榜
    </div>

    <!-- 每日推荐歌单 -->
    <div class="suggest-list-container">
      <div class="head">推荐歌单</div>
      <div class="item-wrap">
        <div class="item" v-for="(item, index) in suggestList" :key="index" @click="handleToList(item.id)">
          <img :src="item.picUrl" alt="" />
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import { banner, suggestList } from '@/common/neteaseApi.js'
export default {
  name: 'HomeView',
  components: {
    NavBar
  },
  data() {
    return {
      banners: [],
      model: 0,
      suggestList: []
    }
  },
  async created() {
    let res = await banner()
    if (res.data.code === 200) {
      this.banners = res.data.banners
    }
    res = await suggestList()
    if (res.data.code === 200) {
      this.suggestList = res.data.result
    }
  },
  methods: {
    // 跳转到歌单页
    handleToList(id) {
      this.$router.push('/list/' + id)
    },
    // 跳转到排行榜
    handleToRank() {
      this.$router.push('/rank')
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
    height: 133px !important;

    img {
      width: 100%;
      height: 133px;
    }
  }

  .rank {
    margin-top: 20px;
    font-size: 10px;
    width: 45px;
    text-align: center;

    .img {
      line-height: 45px;
      height: 45px;
      width: 45px;
      background-color: #ffeff4;
      border-radius: 50%;
      text-align: center;
      margin-bottom: 5px;
    }
  }

  .suggest-list-container {
    margin-top: 40px;

    .head {
      font-size: 16px;
      color: #333333;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .item-wrap {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .item {
        width: 108px;
        height: 140px;
        margin-bottom: 22px;

        img {
          width: 100%;
          border-radius: 10px;
        }
        .name {
          font-size: 10px;
          // 最多显示两行
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
