<template>
  <div class="search-container">
    <!-- 顶部导航条 -->
    <NavBar type="search" @searchWord="handleSearch" @suggest="handleSuggest" :searchWord="searchWord" />
    <div class="loading" v-if="isLoading">
      <v-progress-circular :width="3" color="red" indeterminate></v-progress-circular>
    </div>
    <div class="container" v-else>
      <!-- 历史记录和热搜区 -->
      <div class="search-box" v-show="searchType === 1">
        <!-- 历史记录 -->
        <div class="search-history" v-if="searchHistory.length > 0">
          <div class="head">
            <div class="name">历史</div>
            <v-chip-group class="group">
              <v-chip small color="#f7f7f7" class="chip" v-for="(item, index) in searchHistory" :key="index" @click="handleChangeWord(item)" :ripple="false">{{ item }}</v-chip>
            </v-chip-group>
            <v-icon class="delete" size="16" color="#b2b2b2" @click="handleToClear">mdi-trash-can-outline</v-icon>
          </div>
        </div>
        <!-- 热搜榜 -->
        <div class="search-hot">
          <div class="head">
            <div>热搜榜</div>
          </div>
          <div class="item-container" :class="{ hide: isHide }">
            <div class="search-hot-item" v-for="(item, index) in searchHot" :key="index" @click="handleChangeWord(item.searchWord)">
              <div class="left">
                <div class="search-hot-index" :class="{ hot: index < 3 }">{{ index + 1 }}</div>
                <div class="search-hot-word">
                  <div>
                    {{ item.searchWord }}
                    <img v-if="item.iconUrl" :src="item.iconUrl" />
                  </div>
                  <div>{{ item.content }}</div>
                </div>
              </div>
              <div class="search-hot-count">{{ item.score }}</div>
            </div>
            <div v-if="isHide" class="toggle" @click="isHide = !isHide">
              展开更多热搜
              <v-icon color="#cccccc">mdi-chevron-down</v-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索建议 -->
      <div class="search-box" v-show="searchType === 2">
        <div class="search-suggest">
          <div class="item" v-for="(item, index) in searchSuggest" :key="index" @click="handleSearch(item.keyword)">
            <v-icon size="18" color="#959595">mdi-magnify</v-icon>
            <span v-html="item.keywordShow"></span>
          </div>
        </div>
      </div>

      <!-- 搜索列表 -->
      <!-- ref="scrollContainer" @scroll.passive="handleScroll" -->
      <div class="scroll" v-show="searchType === 3">
        <div class="singleSong">
          <div>单曲</div>
        </div>
        <v-card elevation="0">
          <v-tabs v-model="tab" background-color="transparent" color="red" grow>
            <v-tab v-for="item in items" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item v-for="item in items" :key="item">
              <v-card color="basil" flat v-if="item === '网易云音乐'">
                <v-card-text>
                  <!-- :style="{ paddingTop: topBlankFill + 'px', paddingBottom: bottomBlankFill + 'px' }" -->
                  <div class="search-result">
                    <div class="search-result-item" v-for="(item, index) in searchList" :key="index" @click="handleToPlay(item.id)">
                      <div class="search-result-word">
                        <div v-html="item.nameShow"></div>
                        <div>
                          <span v-for="(i, d) in item.artists" :key="d">
                            <span v-html="i.nameShow"></span>
                            <span v-if="d != item.artists.length - 1">{{ ' / ' }}</span>
                          </span>
                          <span> - </span>
                          <span v-html="item.album.nameShow"></span>
                        </div>
                      </div>
                      <v-icon color="#b4b4b4" size="18">mdi-dots-vertical</v-icon>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
              <v-card color="basil" flat v-else-if="item === 'QQ音乐'">
                <v-card-text>
                  <div class="search-result">
                    <div class="search-result-item" v-for="(item, index) in searchListQQ" :key="index" @click="handleQQ(item.songmid)">
                      <div class="search-result-word">
                        <div v-html="item.nameShow"></div>
                        <div>
                          <span v-for="(i, d) in item.singer" :key="d">
                            <span v-html="i.nameShow"></span>
                            <span v-if="d != item.singer.length - 1">{{ ' / ' }}</span>
                          </span>
                          <span v-if="item.albumname">
                            <span> - </span>
                            <span v-html="item.albumnameShow"></span>
                          </span>
                        </div>
                      </div>
                      <v-icon color="#b4b4b4" size="18">mdi-dots-vertical</v-icon>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import { searchHot, searchSuggest, searchWord } from '@/common/neteaseApi.js'
import { searchWordQQ } from '@/common/QQApi.js'
export default {
  components: {
    NavBar
  },
  data() {
    return {
      searchWord: '',
      searchHot: [],
      searchHistory: [],
      searchType: 1,
      searchList: [],
      searchListQQ: [],
      searchSuggest: [],
      isHide: true,
      isLoading: true,
      tab: null,
      items: ['网易云音乐', 'QQ音乐'],
      // 记录单条数据的高度
      oneHeight: 88,
      // 容器的最大容积
      containerSize: 0,
      // 记录当前滚动的第一个元素的索引
      startIndex: 0
    }
  },
  async created() {
    try {
      const res = await searchHot()
      if (res.data.code === 200) {
        this.searchHot = res.data.data
        this.isLoading = false
      }
    } catch (err) {}

    // 获取历史记录
    this.searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []
  },
  methods: {
    // 定义滚动行为事件方法
    handleScroll() {
      if (this.$refs.scrollContainer.scrollTop >= 150) {
        this.startIndex = Math.floor((this.$refs.scrollContainer.scrollTop - 150) / this.oneHeight)
      }
      console.log(this.startIndex)
    },
    // 计算容器的最大容积
    getSize() {
      this.containerSize = Math.floor(this.$refs.scrollContainer.offsetHeight / this.oneHeight) + 2
    },
    handleSearch(item) {
      if (item !== '') {
        this.handleSuggest(item)
        this.getSearchList(item)
        this.searchHistory.unshift(item)
        // 利用 set 去重
        this.searchHistory = [...new Set(this.searchHistory)]
        // 最多保留十个历史记录
        if (this.searchHistory.length > 10) {
          this.searchHistory.length = 10
        }
        // 本地存储 （以字符串形式存储，所以要转换）
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
      } else {
        this.searchWord = ''
      }
    },
    handleChangeWord(word) {
      this.handleSuggest(word)
    },
    // 清空历史记录
    handleToClear() {
      this.searchHistory = []
      localStorage.removeItem('searchHistory')
    },
    async handleSuggest(val) {
      this.searchWord = val
      if (val !== '') {
        const res = await searchSuggest(val)
        if (res.data.code === 200) {
          this.searchSuggest = res.data.result.allMatch
          // 将匹配部分进行样式替换
          if (this.searchSuggest) {
            this.searchSuggest.forEach((item) => {
              item.keywordShow = item.keyword.replace(val, "<span style='color:#9a9a9a;'>" + val + '</span>')
            })
          }
          this.searchType = 2
        }
      }
    },
    // 播放搜索歌曲
    handleToPlay(id) {
      this.$store.commit('SET_ID', id)
    },
    handleQQ(id) {
      id = 'QQ' + id
      this.$store.commit('SET_ID', id)
    },
    async getSearchList(word) {
      let res = await searchWord(word)
      if (res.data.code === 200) {
        // 默认前30首歌
        this.searchList = res.data.result.songs
        // 将匹配部分进行样式替换
        if (this.searchList) {
          this.searchList.forEach((item) => {
            item.nameShow = item.name.replace(this.searchWord, "<span style='color:#235790;'>" + this.searchWord + '</span>')
            item.album.nameShow = item.album.name.replace(this.searchWord, "<span style='color:#235790;'>" + this.searchWord + '</span>')
            item.artists.forEach((i) => {
              i.nameShow = i.name.replace(this.searchWord, "<span style='color:#235790;'>" + this.searchWord + '</span>')
            })
          })
        }
        this.searchType = 3
        // this.$nextTick(() => {
        //   this.getSize()
        //   console.log(this.$refs.scrollContainer.offsetHeight)
        // })
      }
      res = await searchWordQQ(word)
      this.searchListQQ = res.data.data.list
      // 将匹配部分进行样式替换
      if (this.searchListQQ) {
        this.searchListQQ.forEach((item) => {
          item.nameShow = item.songname.replace(this.searchWord, "<span style='color:#235790;'>" + this.searchWord + '</span>')
          if (item.albumname) {
            item.albumnameShow = item.albumname.replace(this.searchWord, "<span style='color:#235790;'>" + this.searchWord + '</span>')
          }
          item.singer.forEach((i) => {
            i.nameShow = i.name.replace(this.searchWord, "<span style='color:#235790;'>" + this.searchWord + '</span>')
          })
        })
      }
    }
  },
  watch: {
    searchWord(val) {
      // 搜索词为空，返回第一页面
      if (val === '') {
        this.searchType = 1
      }
    }
  },
  computed: {
    // 容器最后一个元素的索引
    endIndex() {
      let endIndex = this.startIndex + this.containerSize
      if (!this.searchList[endIndex]) {
        endIndex = this.searchList[this.searchList.length - 1]
      }
      return endIndex
    },
    // 定义一个待显示的数组列表元素
    showDataList() {
      return this.searchList.slice(this.startIndex, this.endIndex)
    },
    // 定义上空白的高度
    topBlankFill() {
      return this.startIndex * this.oneHeight
    },
    // 定义下空白填充高度
    bottomBlankFill() {
      return (this.searchList.length - this.endIndex) * this.oneHeight
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  .search-box {
    padding: 60px 16px 64px 16px;
    height: 100vh;
    overflow: scroll;
  }

  .scroll {
    padding: 60px 16px 64px 16px;
    height: 100vh;
    overflow: scroll;
  }

  .singleSong {
    height: 20px;
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  ::v-deep .v-tab {
    height: 50px;
  }

  .search-history {
    font-size: 13px;
    color: #000;

    .head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 9px;
      font-weight: 600;

      .name {
        height: 40px;
        width: 35px;
        line-height: 40px;
      }
      .group {
        width: 80vw;
        overflow: scroll;

        .chip {
          font-weight: normal;
          font-size: 13px;
        }
      }
      .delete {
        width: 20px;
      }
    }
  }

  .search-hot {
    margin-top: 15px;
    font-size: 13px;
    color: #000;

    .head {
      margin-bottom: 20px;
      font-weight: 600;
    }

    .item-container {
      position: relative;
      box-shadow: 0px 2px 10px #f7f7f7;
      border-radius: 12px;
      overflow: hidden;

      .toggle {
        height: 30px;
        line-height: 30px;
        position: absolute;
        width: 98%;
        bottom: 0;
        text-align: center;
        color: #989898;
        background-color: rgba(255, 255, 255, 0.95);
      }
    }

    .hide {
      height: 500px;
    }

    .left {
      display: flex;
      align-items: center;
    }

    .search-hot-item {
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .search-hot-index {
        width: 30px;
        margin-left: 4px;
      }

      .hot {
        color: #fb2222;
      }

      .search-hot-word {
        font-size: 15px;
        width: 55vw;

        img {
          max-height: 11px;
        }

        div:nth-child(2) {
          font-size: 12px;
          color: #878787;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .search-hot-count {
        color: #878787;
      }
    }
  }

  .search-suggest {
    font-size: 14px;
    .item {
      display: flex;
      align-items: center;

      span {
        margin-left: 10px;
        padding: 24px 0;
        flex: 1;
        border-bottom: 1px solid #f7f7f7;
      }
    }
  }

  .search-result {
    .search-result-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 63px;
      padding-bottom: 12px;
      margin-bottom: 12px;
      border-bottom: 1px solid #e4e4e4;

      .search-result-word {
        div:nth-child(1) {
          width: 75vw;
          font-size: 14px;
          color: #000;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        div:nth-child(2) {
          width: 75vw;
          font-size: 11px;
          color: #898989;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
