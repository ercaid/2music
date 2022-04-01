<template>
  <v-bottom-sheet v-model="sheet" fullscreen>
    <template v-slot:activator="{ on, attrs }">
      <!-- 播放器 -->
      <audio autoplay ref="audio" @pause="onPause" @ended="onEnded" @play="onPlay" @timeupdate="onTimeupdate" @loadedmetadata="onLoadedmetadata" :src="songUrl"></audio>

      <div class="player" :class="{ hide: sheet }" v-bind="attrs" v-on="on" v-show="songUrl != ''">
        <div class="left">
          <div class="pic">
            <img
              :src="songDetail.al.picUrl"
              onerror="this.src='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%3A%2F%2Fdingyue.ws.126.net%2F2021%2F0329%2Fab0b8e52j00qqpqd7005bc000j600j6m.jpg%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1650703616&t=53edd91f089a0817b5322dfc66058f1d'"
              :class="{ run: audio.playing }"
              alt=""
            />
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

          <!-- 播放列表 -->
          <div class="text-center">
            <v-dialog v-model="songList" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon class="button-list" v-bind="attrs" v-on="on" plain>
                  <v-icon size="26" color="#363636">mdi-playlist-music</v-icon>
                </v-btn>
              </template>
              <div class="playlist">
                <div class="title">
                  当前播放 <span>({{ playList.length }})</span>
                </div>
                <div class="play-list-item" v-for="(item, index) in playList" :key="index" :class="{ active: item.id === currentId }" @click="getSong(item.id)">
                  <div class="name">
                    <v-icon size="12" class="icon" color="#fb362e" v-if="item.id === currentId">mdi-music-note</v-icon>
                    <span>{{ item.name }}</span>
                    <span class="artist" :class="{ active: item.id === currentId }">
                      -
                      <span v-for="(i, d) in item.ar" :key="d">
                        {{ i.name }}
                        <span v-if="d != item.ar.length - 1">/</span>
                      </span>
                    </span>
                  </div>
                  <div class="delete" @click.stop="handleDelete(index, item.id)">
                    <v-icon color="#b4b4b4" size="18">mdi-close</v-icon>
                  </div>
                </div>
              </div>
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
      @playNext="onEnded"
      @playPrevious="playPrevious"
      :progress="progress"
      :currentTime="audio.currentTime"
      :maxTime="audio.maxTime"
      :playing="audio.playing"
      :songDetail="songDetail"
      :lyricIndex="audio.lyricIndex"
      :songLyric="songLyric"
      :sheet="sheet"
    />
  </v-bottom-sheet>
</template>

<script>
import FullPlayer from '@/components/FullPlayer.vue'
import { songDetail, songUrl, songLyric } from '@/common/neteaseApi.js'
import { songDetailQQ, songUrlQQ, songLyricQQ } from '@/common/QQApi.js'
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
        maxTime: 0,
        lyricIndex: 0
      },
      songDetail: {
        al: {
          picUrl: ''
        },
        name: ''
      },
      songUrl: '',
      currentId: 0,
      songLyric: [
        {
          lyric: '暂无歌词',
          time: 0,
          uid: '8888'
        }
      ]
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
    // 当音频结束
    onEnded() {
      if (this.playList.length > 1) {
        // 自动播放下一首
        let nextId = 0
        for (let i = 0; i < this.playList.length; i++) {
          // 如果是列表最后一首，播放第一首
          if (this.currentId === this.playList[this.playList.length - 1].id) {
            nextId = this.playList[0].id
            break
          }
          // 播放下一首
          if (this.currentId === this.playList[i].id) {
            nextId = this.playList[i + 1].id
            break
          }
        }
        this.getSong(nextId)
      }
    },
    // 播放上一首
    playPrevious() {
      if (this.playList.length > 1) {
        let lastId = 0
        for (let i = 0; i < this.playList.length; i++) {
          // 如果是列表第一首，播放最后一首
          if (this.currentId === this.playList[0].id) {
            lastId = this.playList[this.playList.length - 1].id
            break
          }
          if (this.currentId === this.playList[i].id) {
            lastId = this.playList[i - 1].id
            break
          }
        }
        this.getSong(lastId)
      }
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      this.audio.currentTime = res.target.currentTime

      // 匹配歌词
      for (let i = 0; i < this.songLyric.length; i++) {
        if (this.audio.currentTime > this.songLyric[this.songLyric.length - 1].time) {
          this.audio.lyricIndex = this.songLyric.length - 1
          break
        }
        if (this.audio.currentTime > this.songLyric[i].time && this.audio.currentTime < this.songLyric[i + 1].time) {
          this.audio.lyricIndex = i
        }
      }
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      this.audio.maxTime = parseInt(res.target.duration)
    },
    changeProgress(val) {
      this.$refs.audio.currentTime = val
    },
    async getSong(id) {
      if (id) {
        if (id.toString().slice(0, 2) === 'QQ') {
          // QQ音乐链接
          this.currentId = id
          this.audio.playing = false
          // 获取歌曲详情
          id = id.substring(2)
          let res = await songDetailQQ(id)
          res = res.data
          const obj = {
            al: {
              picUrl: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${res.data.track_info.album.mid}.jpg`
            },
            name: res.data.track_info.name,
            ar: res.data.track_info.singer,
            id: 'QQ' + id
          }
          if (res.result === 100) {
            this.songDetail = obj
          }
          // 如果没有这首歌，添加到播放列表里面
          const list = this.playList
          let find = false
          for (let i = 0; i < list.length; i++) {
            if (list[i].id === 'QQ' + id) {
              find = true
              break
            }
          }
          if (!find) {
            list.unshift(this.songDetail)
            this.$store.commit('INIT_List', list)
          }

          res = await songUrlQQ(id)
          console.log(res.data)
          if (res.data.result === 100) {
            this.songUrl = res.data.data || ''
          }

          // 获取歌词
          res = await songLyricQQ(id)
          if (res.data.result === 100) {
            try {
              const lyric = res.data.data.lyric
              // 匹配每行
              const regNewLine = /\n/
              let lineArr = lyric.split(regNewLine) // 每行歌词的数组
              if (lineArr[0].slice(0, 3) === '[ti') {
                lineArr = lineArr.splice(5)
              }
              // 匹配时间
              const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/
              const songLyric = []
              lineArr.forEach((item) => {
                if (item === '') return
                const obj = {}
                const time = item.match(regTime)
                obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim()
                obj.time = time ? this.formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0
                obj.uid = Math.random().toString().slice(-6)
                if (obj.lyric === '') {
                  // console.log('这一行没有歌词')
                } else {
                  songLyric.push(obj)
                }
              })
              this.songLyric = songLyric
            } catch (err) {
              this.songLyric = [
                {
                  lyric: '暂无歌词',
                  time: 0,
                  uid: '8888'
                }
              ]
            }
          }
        } else {
          // 网易云链接
          this.currentId = id
          this.audio.playing = false
          // 获取歌曲详情
          let res = await songDetail(id)
          if (res.data.code === 200) {
            this.songDetail = res.data.songs[0]
          }
          // 如果没有这首歌，添加到播放列表里面
          const list = this.playList
          let find = false
          for (let i = 0; i < list.length; i++) {
            if (list[i].id === id) {
              find = true
              break
            }
          }
          if (!find) {
            list.unshift(this.songDetail)
            this.$store.commit('INIT_List', list)
          }
          // 获取歌曲链接
          res = await songUrl(id)
          if (res.data.code === 200) {
            this.songUrl = res.data.data[0].url || ''
          }
          // 获取歌词
          res = await songLyric(id)
          if (res.data.code === 200) {
            const lyric = res.data.lrc.lyric
            // 匹配每行
            const regNewLine = /\n/
            const lineArr = lyric.split(regNewLine) // 每行歌词的数组
            // 匹配时间
            const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/
            const songLyric = []
            lineArr.forEach((item) => {
              if (item === '') return
              const obj = {}
              const time = item.match(regTime)
              obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim()
              obj.time = time ? this.formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0
              obj.uid = Math.random().toString().slice(-6)
              if (obj.lyric === '') {
                // console.log('这一行没有歌词')
              } else {
                songLyric.push(obj)
              }
            })
            this.songLyric = songLyric
          }
        }
      }
    },
    // 格式化歌词时间
    formatLyricTime(time) {
      // 格式化歌词的时间 转换成 sss:ms
      const regMin = /.*:/
      const regSec = /:.*\./
      const regMs = /\./

      const min = parseInt(time.match(regMin)[0].slice(0, 2))
      let sec = parseInt(time.match(regSec)[0].slice(1, 3))
      const ms = time.slice(time.match(regMs).index + 1, time.match(regMs).index + 3)
      if (min !== 0) {
        sec += min * 60
      }
      return Number(sec + '.' + ms)
    },
    // 删除列表歌曲
    handleDelete(index, id) {
      // 如果是正在播放的歌
      if (id === this.currentId) {
        this.onEnded()
      }
      const list = this.playList
      list.splice(index, 1)
      this.$store.commit('INIT_List', list)
    }
  },
  computed: {
    progress() {
      return (this.audio.currentTime / this.audio.maxTime) * 100
    },
    songId() {
      return this.$store.state.songId
    },
    playList() {
      return this.$store.state.playList
    }
  },
  watch: {
    songId: {
      // 侦听器的处理函数
      handler(val) {
        this.getSong(val)
      },
      immediate: true
    }
  },
  created() {
    // 获取收藏歌曲列表
    const list = JSON.parse(localStorage.getItem('likeList')) || []
    if (list.length) {
      // 自动选择列表第一首歌
      this.getSong(list[0].id)
      this.$store.commit('INIT_List', list)
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
  bottom: -2px;
  transition: all 0.5s;
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
      margin: -20px 9px 0 16px;
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

::v-deep .v-dialog {
  box-shadow: none;
}

.playlist {
  background-color: #fff;
  border-radius: 25px;
  height: 500px;
  padding: 25px 16px;
  overflow: scroll;

  .title {
    margin-bottom: 20px;
    font-size: 18px;

    span {
      font-size: 11px;
      color: #808080;
    }
  }

  .play-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    padding-bottom: 25px;

    .name {
      width: 65vw;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      .artist {
        color: #808080;
        font-size: 10px;
      }
      .icon {
        margin-right: 5px;
      }
    }
  }

  .active {
    color: #fb362e !important;
  }
}
</style>
