<template>
  <v-bottom-sheet v-model="sheet" fullscreen>
    <template v-slot:activator="{ on, attrs }">
      <!-- 播放器 -->
      <audio ref="audio" @pause="onPause" @play="onPlay" @timeupdate="onTimeupdate" @loadedmetadata="onLoadedmetadata" :src="songUrl"></audio>

      <div class="player" :class="{ hide: sheet }" v-bind="attrs" v-on="on">
        <div class="left">
          <div class="pic">
            <img :src="songDetail.al.picUrl" :class="{ run: audio.playing }" alt="" />
          </div>
          <div class="content">
            {{ songDetail.name + ' - ' }}
            <span v-for="(item, index) in songDetail.ar" :key="index"
              >{{ item.name }}
              <span v-if="index != songDetail.ar.length - 1">{{ ' / ' }}</span>
            </span>
          </div>
        </div>

        <div class="button">
          <v-progress-circular class="button-play" :rotate="-90" :size="26" :width="0.5" :value="progress" color="#5e5e5e">
            <v-btn icon @click.stop="startPlayOrPause" plain>
              <v-icon size="18" color="#363636">{{ audio.playing ? 'mdi-pause' : 'mdi-play' }}</v-icon>
            </v-btn>
          </v-progress-circular>

          <div class="text-center">
            <v-dialog v-model="songList" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon class="button-list" v-bind="attrs" v-on="on" plain>
                  <v-icon size="26" color="#363636">mdi-playlist-music</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-text> </v-card-text>
                <v-card-text> 播放列表 </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="songList = false"> 关闭 </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </div>
    </template>
    <!-- 播放器 -->
    <FullPlayer
      @changeProgress="changeProgress"
      @hide="hide"
      @changePlayState="startPlayOrPause"
      :progress="progress"
      :currentTime="audio.currentTime"
      :maxTime="audio.maxTime"
      :playing="audio.playing"
      :songDetail="songDetail"
    />
  </v-bottom-sheet>
</template>

<script>
import FullPlayer from '@/components/FullPlayer.vue'
import { songDetail, songUrl } from '@/common/neteaseApi.js'
export default {
  components: {
    FullPlayer
  },
  data() {
    return {
      sheet: false,
      songList: false,
      audio: {
        playing: false,
        currentTime: 0,
        maxTime: 0
      },
      songDetail: {
        al: {
          picUrl: ''
        },
        name: ''
      },
      songUrl: ''
    }
  },
  methods: {
    // 子组件传隐藏的值给父组件控制播放器隐藏
    hide(val) {
      this.sheet = val
    },
    // 控制音频的播放与暂停
    startPlayOrPause() {
      return this.audio.playing ? this.pause() : this.play()
    },
    // 播放音频
    play() {
      this.$refs.audio.play()
    },
    // 暂停音频
    pause() {
      this.$refs.audio.pause()
    },
    // 当音频播放
    onPlay() {
      this.audio.playing = true
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      this.audio.currentTime = res.target.currentTime
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      this.audio.maxTime = parseInt(res.target.duration)
    },
    changeProgress(val) {
      this.$refs.audio.currentTime = val
    }
  },
  async created() {
    let res = await songDetail(1923482571)
    if (res.data.code === 200) {
      this.songDetail = res.data.songs[0]
    }
    res = await songUrl(1923482571)
    if (res.data.code === 200) {
      this.songUrl = res.data.data[0].url || ''
    }
  },
  computed: {
    progress() {
      return (this.audio.currentTime / this.audio.maxTime) * 100
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: space-between;
  bottom: 0px;
  transition: 0.5s;
  z-index: 4;
  height: 53px;
  width: 100%;
  border-top: 0.5px solid #ececec;
  background-color: rgba(255, 255, 255, 0.95);

  .left {
    display: flex;
    .pic {
      background-color: #050507;
      width: 40px;
      height: 40px;
      border-radius: 50% !important;
      margin: -18px 9px 0 16px;
      overflow: hidden;
      text-align: center;
      img {
        margin-top: 6.5px;
        width: 27px;
        height: 27px;
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

    .content {
      font-size: 13px;
      color: #2b2b2b;
      width: 180px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .button {
    display: flex;
    align-items: center;
    .button-play {
      margin-right: 23px;
    }
    .button-list {
      margin-right: 17px;
    }
  }
}
.hide {
  bottom: -1000px;
}
</style>
