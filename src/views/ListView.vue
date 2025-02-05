<template>
  <div class="list">
    <NavBar name="歌单" bgcolor="rgba(255,255,255,0)" white="true" />
    <div class="loading" v-if="isLoading">
      <v-progress-circular :width="3" color="red" indeterminate></v-progress-circular>
    </div>
    <div class="container" v-if="!isLoading">
      <div class="bg" :style="{ backgroundImage: `url(${list.coverImgUrl})` }"></div>
      <!-- 头部信息区域 -->
      <div class="head">
        <div class="list-head-img">
          <div class="playcount">
            <v-icon size="16" color="#fff">mdi-play-outline</v-icon>
            {{ list.playCount | formatCount }}
          </div>
          <img :src="list.coverImgUrl" />
        </div>
        <div class="list-head-text">
          <div>{{ list.name }}</div>
          <div>
            <img :src="list.creator.avatarUrl" />
            <span>{{ list.creator.nickname }}</span>
          </div>

          <div>{{ list.description }}</div>
        </div>
      </div>
      <!-- 歌单列表区域 -->
      <div class="list-music">
        <div class="list-music-head" @click="handleToPlay(list.tracks[0].id)">
          <v-icon color="#fff" size="14" class="playall">mdi-play</v-icon>
          <span class="play">播放全部</span>
          <span class="all">({{ list.trackCount }})</span>
        </div>
        <div class="list-music-item" v-for="(item, index) in list.tracks" :key="index" @click="handleToPlay(item.id)">
          <div class="list-music-index">{{ index + 1 }}</div>
          <div class="list-music-song">
            <div>{{ item.name }}</div>
            <div>
              <span v-for="(i, d) in item.ar" :key="d">
                {{ i.name }}
                <span v-if="d != item.ar.length - 1">/</span>
              </span>
              <span>{{ ' - ' + item.al.name }}</span>
            </div>
          </div>
          <div class="more">
            <v-icon color="#b4b4b4" size="18">mdi-dots-vertical</v-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import { listDetail } from '@/common/neteaseApi.js'
export default {
  components: {
    NavBar
  },
  data() {
    return {
      list: {
        coverImgUrl: '',
        name: '',
        creator: {},
        description: '',
        tracks: []
      },
      isLoading: true
    }
  },
  async created() {
    try {
      const res = await listDetail(this.$route.params.id)
      if (res.data.code === 200) {
        this.list = res.data.playlist
        this.isLoading = false
      }
    } catch (err) {
      throw new Error(err)
    }
  },
  methods: {
    handleToPlay(id) {
      this.$store.commit('SET_ID', id)
      // 替换当前播放列表
      // 深拷贝，解决修改播放列表时歌单的数据也会变的问题
      this.$store.commit('INIT_List', JSON.parse(JSON.stringify(this.list.tracks)))
    }
  }
}
</script>

<style lang="scss" scoped>
.head {
  position: fixed;
  top: 65px;
  display: flex;
  height: 115px;
  margin: 0 16px;

  .list-head-img {
    width: 115px;
    height: 115px;
    border-radius: 15px;
    overflow: hidden;
    position: relative;
    margin-right: 14px;

    img {
      width: 100%;
      height: 100%;
    }

    .playcount {
      position: absolute;
      display: flex;
      align-items: center;
      right: 8px;
      top: 4px;
      color: #fff;
      font-size: 10px;
    }
  }

  .list-head-text {
    flex: 1;
    color: #f0f2f7;

    div:nth-child(1) {
      color: #fff;
      font-size: 14px;
      line-height: 24px;
      width: 55vw;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    div:nth-child(2) {
      display: flex;
      align-items: center;
      margin: 10px 0;
      font-size: 10px;

      span {
        width: 120px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }

    div:nth-child(3) {
      font-size: 10px;
      width: 55vw;
      // 最多显示两行
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}

.list-music {
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: #fff;
  border-radius: 30px 30px 0 0;
  height: calc(100vh - 220px);
  overflow: scroll;
  padding-bottom: 50px;

  .list-music-head {
    height: 50px;
    padding-top: 10px;
    padding-left: 18px;

    .playall {
      background-color: #fb362e;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-right: 15px;
    }

    .play {
      font-size: 15px;
      margin-right: 9px;
    }

    .all {
      font-size: 13px;
      color: #b2b2b2;
    }
  }

  .list-music-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    color: #959595;
    margin-bottom: 24px;

    .list-music-index {
      padding-top: 5px;
      width: 29px;
      margin-left: 13px;
      font-size: 15px;
      text-align: center;
    }

    .list-music-song {
      flex: 1;
      margin-left: 10px;

      div:nth-child(1) {
        width: 60vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        color: #000;
      }

      div:nth-child(2) {
        width: 60vw;
        font-size: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .more {
      margin-top: 5px;
      margin-right: 18px;
    }
  }
}
</style>
