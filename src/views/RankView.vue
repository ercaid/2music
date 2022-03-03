<template>
  <div class="rank-container">
    <!-- 顶部导航条 -->
    <NavBar name="排行榜" />
    <!-- 内容区 -->
    <div class="rank-content">
      <!-- 官方榜 -->
      <div class="guanfang">
        <div class="title">官方榜</div>
        <div class="guanfang-rank-item" v-for="(item, index) in topList" :key="index" @click="handleToList(item.id)">
          <div class="update">{{ item.updateFrequency }}</div>
          <div class="left">
            <div class="name">{{ item.name }}</div>
            <div class="imgs">
              <img v-for="(i, d) in listDetail[index]" :key="d" :src="i.al.picUrl" alt="" />
            </div>
          </div>
          <div class="right">
            <div class="song-item" v-for="(i, d) in item.tracks" :key="d">
              <span>{{ d + 1 }}. {{ i.first }}</span> - {{ i.second }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { topList, listDetail } from '@/common/neteaseApi.js'
import NavBar from '@/components/NavBar.vue'
export default {
  components: {
    NavBar
  },
  data() {
    return {
      topList: [],
      listDetail: []
    }
  },
  async created() {
    const res = await topList()
    if (res.data.code === 200) {
      this.topList = res.data.list
      // 只要前四项
      this.topList.length = 4
      let temp = null
      temp = this.topList[3]
      this.topList[3] = this.topList[2]
      this.topList[2] = temp
    }
    for (let i = 0; i < this.topList.length; i++) {
      const res = await listDetail(this.topList[i].id)
      if (res.data.code === 200) {
        this.listDetail.push(res.data.playlist.tracks)
        // 只要前三项
        this.listDetail[i].length = 3
      }
    }
  },
  methods: {
    // 跳转到歌单页
    handleToList(id) {
      this.$router.push('/list/' + id)
    }
  }
}
</script>

<style lang="scss" scoped>
.rank-container {
  margin: 0 16px;
  margin-top: 56px;
  padding-bottom: 64px;
  .rank-content {
    margin-top: 14px;
    .guanfang {
      .title {
        font-size: 17px;
        font-weight: 600;
        color: #333333;
        margin-bottom: 14px;
      }
      .guanfang-rank-item {
        display: flex;
        position: relative;
        height: 125px;
        border-radius: 15px;
        margin-bottom: 10px;

        .update {
          position: absolute;
          right: 10px;
          font-size: 9px;
          top: 7px;
          color: #aaaaaa;
        }

        .left {
          height: 125px;
          width: 125px;
          display: flex;
          flex-direction: column;
          .name {
            font-size: 19px;
            font-weight: 600;
            margin: 12px 0 8px 20px;
          }
          .imgs {
            margin-left: 20px;
            position: relative;
            img {
              position: absolute;
            }
            img:nth-child(1) {
              width: 60px;
              height: 60px;
              border-radius: 10px;
              z-index: 3;
            }
            img:nth-child(2) {
              width: 47px;
              height: 47px;
              border-radius: 8px;
              top: 13px;
              left: 23px;
              z-index: 2;
              opacity: 0.6;
            }
            img:nth-child(3) {
              width: 35px;
              height: 35px;
              border-radius: 6px;
              top: 25px;
              left: 45px;
              opacity: 0.2;
            }
          }
        }
        .right {
          margin: 20px 0;
          width: 160px;
          display: flex;
          flex-direction: column;

          .song-item {
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            height: 30px;
            line-height: 30px;
            text-overflow: ellipsis;
            color: #959595;

            span {
              color: #333333;
            }
          }
        }
      }

      .guanfang-rank-item:nth-child(2) {
        background: #f4e1e7;
        .name {
          color: #e63377;
        }
      }
      .guanfang-rank-item:nth-child(3) {
        background: #e0eaeb;
        .name {
          color: #279885;
        }
      }
      .guanfang-rank-item:nth-child(4) {
        background: #f4e0df;
        .name {
          color: #df252c;
        }
      }
      .guanfang-rank-item:nth-child(5) {
        background: #e3e5f1;
        .name {
          color: #3b71bb;
        }
      }
    }
  }
}
</style>
