<template>
  <v-sheet class="player-container" height="100vh">
    <div class="bg" :style="{ backgroundImage: `url(${songDetail.al.picUrl})` }"></div>
    <div class="head">
      <v-icon color="#fff" @click="handleHide" class="hide" size="40">mdi-chevron-down</v-icon>

      <div class="title">
        <div class="song">{{ songDetail.name }}</div>
        <div class="artist">
          <span v-for="(item, index) in songDetail.ar" :key="index"
            >{{ item.name }}
            <span v-if="index != songDetail.ar.length - 1">{{ ' / ' }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- 歌曲图片 -->
    <div class="img" v-show="!showLyric" @click="showLyric = !showLyric">
      <!-- 宇宙尘埃 -->
      <canvas id="dust" height="255" width="255" style="position: absolute; z-index: 1"></canvas>
      <img :src="songDetail.al.picUrl" :class="{ run: playing }" alt="" />
    </div>
    <!-- 歌词 -->
    <div class="lyric" v-show="showLyric" @click="showLyric = !showLyric">
      <div class="detail-lyric-wrap" :style="{ transform: 'translateY(' + -(lyricIndex - 5) * 40 + 'px)' }">
        <div class="item" v-for="(item, index) in songLyric" :key="index" :class="{ active: lyricIndex === index }">{{ item.lyric }}</div>
      </div>
    </div>

    <!-- 底部播放按钮 -->
    <div class="buttonList">
      <div class="first-row">
        <v-btn class="item" icon plain>
          <v-icon color="rgba(255,255,255,0.8)" size="25">mdi-heart-outline</v-icon>
        </v-btn>
        <v-btn class="item" icon plain>
          <v-icon color="rgba(255,255,255,0.8)" size="25">mdi-message-text-outline</v-icon>
        </v-btn>
        <v-btn class="item" icon plain>
          <v-icon color="rgba(255,255,255,0.8)" size="25">mdi-dots-vertical</v-icon>
        </v-btn>
      </div>
      <!-- 播放进度 -->
      <div class="second-row">
        <div class="strat-time">{{ currentTime | realFormatSecond }}</div>
        <div class="progress">
          <v-slider color="#fff" track-color="rgba(255, 255, 255, 0.5)" v-model="curTime" @end="handleToggle"></v-slider>
        </div>
        <div class="full-time">{{ maxTime | realFormatSecond }}</div>
      </div>
      <!-- 播放暂停，上一首下一首 -->
      <div class="third-row">
        <v-btn class="item" icon plain @click="handlePrevious">
          <v-icon color="rgba(255,255,255,0.8)" size="28">mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn class="item" icon plain @click="handlePlay">
          <v-icon color="#fff" size="28">{{ playing ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        </v-btn>
        <v-btn class="item" icon plain @click="handleNext">
          <v-icon color="rgba(255,255,255,0.8)" size="28">mdi-skip-next</v-icon>
        </v-btn>
      </div>
    </div>
  </v-sheet>
</template>

<script>
export default {
  props: ['songDetail', 'playing', 'currentTime', 'maxTime', 'progress', 'lyricIndex', 'songLyric'],
  data() {
    return {
      curTime: this.progress,
      showLyric: false
    }
  },
  methods: {
    handleHide() {
      this.$emit('hide', false)
    },
    handlePlay() {
      this.$emit('changePlayState')
    },
    handleToggle() {
      const time = parseInt((this.curTime / 100) * this.maxTime)
      this.$emit('changeProgress', time)
    },
    handleNext() {
      this.$emit('playNext')
    },
    handlePrevious() {
      this.$emit('playPrevious')
    },
    // 画宇宙尘埃
    drawDust() {
      // 配置项
      // 粒子数目
      const particleNum = 1000
      // 圆半径
      const radius = 112.5
      // 最大偏移半径
      const maxRadius = 122.5
      // 速度
      const speed = 1.5

      // 创建一个粒子类，包括：角度，半径，速度，透明度
      class Particle {
        constructor(deg, radius, speed, alpha, maxOffset) {
          this.deg = deg
          this.radius = radius
          this.speed = speed
          this.alpha = alpha
        }
      }

      // 找到画布
      const canvas = document.querySelector('#dust')
      // 上下文对象（画笔）
      const ctx = canvas.getContext('2d')

      // 创建粒子列表
      const particleList = []
      for (let i = 1; i < particleNum; i++) {
        // 角度在 0 到 2PI 之间随机
        const random = Math.random() * 2 * Math.PI
        const particle = new Particle(random, radius, speed, 1)
        particleList.push(particle)
      }

      // 运动动画
      const run = (context) => {
        // 清除像素
        context.clearRect(0, 0, 600, 600)
        particleList.forEach((item) => {
          // 超过范围回位
          if (item.radius >= maxRadius) {
            item.radius = radius
          }
          // 笔触透明度
          item.alpha = 1 - (item.radius - radius) / (maxRadius - radius)
          context.strokeStyle = `rgba(255, 255, 255, ${item.alpha})`
          // 画圆：x坐标, y坐标, 半径, 起始角, 结束角
          context.beginPath()
          context.arc(127.5, 127.5, item.radius, item.deg, item.deg + 0.002)
          context.closePath()
          // 画完了之后增加半径
          item.radius += Math.random() * item.speed
          // 画点
          context.stroke()
        })
      }

      // 更新点
      setInterval(() => {
        run(ctx)
      }, 50)
    }
  },
  mounted() {
    this.drawDust()
  },
  filters: {
    // 将整数转换成 分：秒的格式
    realFormatSecond(second) {
      const secondType = typeof second
      if (secondType === 'number' || secondType === 'string') {
        second = parseInt(second)
        const hours = Math.floor(second / 3600)
        second = second - hours * 3600
        const mimute = Math.floor(second / 60)
        second = second - mimute * 60
        return ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
      } else {
        return '00:00'
      }
    }
  },
  watch: {
    progress(val) {
      this.curTime = val
    }
  }
}
</script>

<style lang="scss" scoped>
.player-container {
  // 遮罩层
  .bg::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1;
  }
  .head {
    color: #fff;
    .hide {
      padding-left: 10px;
      padding-top: 10px;
    }
    .title {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: fixed;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      .song {
        text-align: center;
        margin-top: 15px;
        font-size: 17px;
        height: 20px;
        line-height: 20px;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .artist {
        text-align: center;
        margin-top: 3px;
        font-size: 12px;
        height: 15px;
        line-height: 15px;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #aaaaaa;
      }
    }
  }
  .img {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: relative;
    z-index: 1;
    width: 100%;
    height: 390px;

    img {
      margin-bottom: 20px;
      width: 215px;
      height: 215px;
      border-radius: 50%;
      animation: 20s linear move infinite;
      animation-play-state: paused;
    }

    @keyframes move {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .run {
      animation-play-state: running;
    }
  }

  .lyric {
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 1;
    width: 100%;
    // 显示15行
    height: 450px;
    font-size: 15px;
    overflow: hidden;
    top: 50%;
    transform: translateY(-60%);
    text-align: center;
    color: #6f6e73;

    .detail-lyric-wrap {
      transition: 0.5s;
      .item {
        height: 40px;
        line-height: 40px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .active {
        color: #fff;
      }
    }
  }

  .buttonList {
    color: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;

    .first-row {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;

      .item {
        margin: 0 20px;
      }
    }
    .second-row {
      margin: 0 18px;
      display: flex;
      font-size: 10px;
      color: #aaaaaa;
      justify-content: space-between;

      .progress {
        margin: -8px 12px 0 12px;
        flex: 1;
      }
    }
    .third-row {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
      margin-top: -12px;

      .item {
        margin: 0 12px;
      }

      .item:nth-child(2) {
        padding: 18px;
        border: 1px solid #fff;
        border-radius: 50%;
      }
    }
  }
}
</style>
