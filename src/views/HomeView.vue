<template>
  <div class="home-container">
    <!-- 顶部导航条 -->
    <NavBar type="home" />
    <div class="loading" v-if="isLoading">
      <v-progress-circular :width="3" color="red" indeterminate></v-progress-circular>
    </div>
    <!-- 内容区 -->
    <div class="container" v-else>
      <!-- 轮播图 -->
      <v-carousel cycle v-model="model" class="banner" :show-arrows="false" delimiter-icon="mdi-minus" hide-delimiter-background hide-delimiters height="38.88vw">
        <v-carousel-item v-for="(item, index) in banners" :src="item.pic" :key="index" @click.stop="handlePlay(item.song)"> </v-carousel-item>
      </v-carousel>
      <div class="link">
        <div class="rank" @click="handleTo('/rank')">
          <div class="img">
            <v-icon color="#fd3b41">mdi-trending-up</v-icon>
          </div>
          排行榜
        </div>
        <div class="rank" @click="handleTo('/daily')">
          <div class="img">
            <v-icon color="#fd3b41">mdi-calendar-range</v-icon>
          </div>
          日推
        </div>
      </div>
      <div class="song-list">
        <!-- 每日推荐歌单 -->
        <div class="suggest-list-container">
          <div class="head">推荐歌单</div>
          <v-chip-group class="item-wrap">
            <div class="item" v-for="(item, index) in suggestList" :key="index" @click="handleToList(item.id)">
              <img :src="item.picUrl" alt="" />
              <div class="name">{{ item.name }}</div>
            </div>
          </v-chip-group>
        </div>
        <!-- 私人雷达歌单 -->
        <div class="suggest-list-container" v-if="userinfo.name">
          <div class="head">{{ userinfo.name }}的私人雷达</div>
          <v-chip-group class="item-wrap">
            <div class="item" v-for="(item, index) in dailyList" :key="index" @click="handleToList(item.id)">
              <img :src="item.picUrl" alt="" />
              <div class="name">{{ item.name }}</div>
            </div>
          </v-chip-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import { banner, suggestList, dailyList } from '@/common/neteaseApi.js'
export default {
  name: 'HomeView',
  components: {
    NavBar
  },
  data() {
    return {
      banners: [],
      model: 0,
      suggestList: [],
      dailyList: [],
      isLoading: true
    }
  },
  async created() {
    try {
      let res = await banner()
      if (res.data.code === 200) {
        this.banners = res.data.banners
      }
      res = await suggestList()
      if (res.data.code === 200) {
        this.suggestList = res.data.result
        if (!this.userinfo.name) {
          this.isLoading = false
        } else {
          this.getPersonalList()
        }
      }
    } catch (err) {
      throw new Error(err)
    }
  },
  methods: {
    // 跳转到歌单页
    handleToList(id) {
      this.$router.push('/list/' + id)
    },
    // 跳转到排行榜
    handleTo(url) {
      this.$router.push(url)
    },
    // 私人雷达
    async getPersonalList() {
      const res = await dailyList()
      if (res.data.code === 200) {
        this.dailyList = res.data.recommend
        this.isLoading = false
      }
    },
    // banner歌曲播放
    handlePlay(song) {
      if (song) {
        this.$store.commit('SET_ID', song.id)
      }
    }
  },
  watch: {
    userinfo() {
      if (this.userinfo.name) {
        this.getPersonalList()
      }
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
.home-container {
  margin: 0 16px;
  margin-top: 60px;
  padding-bottom: 64px;

  .banner {
    margin: 0 auto;
    text-align: center;
  }

  .link {
    display: flex;
  }

  .rank {
    margin-top: 20px;
    font-size: 10px;
    width: 45px;
    text-align: center;
    margin-right: 20px;

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
  .song-list {
    margin-top: 40px;
  }
  .suggest-list-container {
    .head {
      font-size: 16px;
      color: #333333;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .item-wrap {
      display: flex;
      white-space: nowrap;
      overflow: scroll;
      .item {
        float: left;
        width: 108px;
        height: 140px;
        margin: 0 11px;
        margin-bottom: 10px;

        img {
          width: 100%;
          border-radius: 10px;
        }
        .name {
          font-size: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    // 隐藏滚动条
    .item-wrap::-webkit-scrollbar {
      width: 0 !important;
    }
  }
}
</style>
