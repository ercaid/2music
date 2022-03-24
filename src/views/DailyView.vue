<template>
  <div class="list">
    <NavBar name="日推" bgcolor="rgba(255,255,255,0)" :white="true" />
    <div class="loading" v-if="isLoading">
      <v-progress-circular :width="3" color="red" indeterminate></v-progress-circular>
    </div>
    <div class="container" v-if="!isLoading">
      <!-- 头部信息区域 -->
      <div class="box">
        <div class="date">
          <span class="day">{{ date.getDate() | dateFormat }}</span>
          <span class="month"> / {{ (date.getMonth() + 1) | dateFormat }}</span>
        </div>
      </div>
      <!-- 歌单列表区域 -->
      <div class="list-music">
        <div class="list-music-head" @click="handleToPlay(dailyList[0].id)">
          <v-icon color="#fff" size="14" class="playall">mdi-play</v-icon>
          <span class="play">播放全部</span>
          <span class="all">({{ dailyList.length }})</span>
        </div>
        <div class="list-music-item" v-for="(item, index) in dailyList" :key="index" @click="handleToPlay(item.id)">
          <div class="pic">
            <img :src="item.al.picUrl" alt="" />
          </div>
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
import { dailySong } from '@/common/neteaseApi.js'
export default {
  name: 'DailyView',
  components: {
    NavBar
  },
  data() {
    return {
      date: new Date(),
      dailyList: [],
      isLoading: true
    }
  },
  methods: {
    handleToPlay(id) {
      this.$store.commit('SET_ID', id)
      // 替换当前播放列表
      this.$store.commit('INIT_List', JSON.parse(JSON.stringify(this.dailyList)))
    }
  },
  async created() {
    try {
      const res = await dailySong()
      if (res.data.code === 200) {
        this.dailyList = res.data.data.dailySongs
        setTimeout(() => {
          this.isLoading = false
        }, 500)
      }
    } catch (err) {
      throw new Error(err)
    }
  },
  filters: {
    dateFormat(val) {
      return val < 10 ? '0' + val : val
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .box {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 250px;
    // background-color: pink;
    background-image: linear-gradient(#dd2b21, #fff);
    .date {
      position: absolute;
      left: 20px;
      bottom: 50px;
      color: #fff;
      .day {
        font-size: 35px;
      }
      .month {
        font-size: 16px;
      }
    }
  }
  .list-music {
    position: relative;
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

      .pic {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        overflow: hidden;
        margin-left: 13px;
        img {
          width: 100%;
          height: 100%;
        }
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
}
</style>
