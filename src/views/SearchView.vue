<template>
  <div class="search-container">
    <!-- 顶部导航条 -->
    <NavBar type="search" @searchWord="handleSearch" @suggest="handleSuggest" :searchWord="searchWord" />
    <div class="loading" v-if="isLoading">
      <v-progress-circular :width="3" color="red" indeterminate></v-progress-circular>
    </div>
    <div class="container" v-else>
      <!-- 历史记录和热搜区 -->
      <div v-show="searchType === 1">
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
      <div v-show="searchType === 2">
        <div class="search-suggest">
          <div class="item" v-for="(item, index) in searchSuggest" :key="index" @click="handleSearch(item.keyword)">
            <v-icon size="18" color="#959595">mdi-magnify</v-icon>
            <span v-html="item.keywordShow"></span>
          </div>
        </div>
      </div>

      <!-- 搜索列表 -->
      <div v-show="searchType === 3">
        <div class="singleSong">
          <div>单曲</div>
        </div>
        <v-card>
          <v-tabs v-model="tab" background-color="transparent" color="red" grow>
            <v-tab v-for="item in items" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item v-for="item in items" :key="item">
              <v-card color="basil" flat v-if="item === '网易云音乐'">
                <v-card-text>
                  <div class="search-result">
                    <div class="search-result-item" v-for="(item, index) in searchList" :key="index" @click="handleToPlay(item.id)">
                      <div class="search-result-word">
                        <div>{{ item.name }}</div>
                        <div>
                          <span v-for="(i, d) in item.artists" :key="d"
                            >{{ i.name }}
                            <span v-if="d != item.artists.length - 1">{{ ' / ' }}</span>
                          </span>
                          <span>{{ ' - ' + item.album.name }}</span>
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
                    <div class="search-result-item" v-for="(item, index) in searchListQQ" :key="index">
                      <div class="search-result-word">
                        <div>{{ item.songname }}</div>
                        <div>
                          <span v-for="(i, d) in item.singer" :key="d"
                            >{{ i.name }}
                            <span v-if="d != item.singer.length - 1">{{ ' / ' }}</span>
                          </span>
                          <span v-if="item.albumname">{{ ' - ' + item.albumname }}</span>
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
import { searchWord as searchWordQQ } from '@/common/QQApi.js'
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
      items: ['网易云音乐', 'QQ音乐']
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
    async getSearchList(word) {
      let res = await searchWord(word)
      if (res.data.code === 200) {
        // 默认前30首歌
        this.searchList = res.data.result.songs
        this.searchType = 3
      }
      res = await searchWordQQ(word)
      this.searchListQQ = res.data.data.list
    }
  },
  watch: {
    searchWord(val) {
      // 搜索词为空，返回第一页面
      if (val === '') {
        this.searchType = 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  margin: 0 16px;
  margin-top: 60px;
  padding-bottom: 64px;

  .singleSong {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 20px;
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
        position: absolute;
        width: 98%;
        bottom: 0;
        text-align: center;
        color: #989898;
        background-color: rgba(255, 255, 255, 0.95);
      }
    }

    .hide {
      height: 180px;
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
      padding-bottom: 15px;
      margin-bottom: 15px;
      border-bottom: 1px solid #e4e4e4;

      .search-result-word {
        div:nth-child(1) {
          width: 80vw;
          font-size: 14px;
          color: #235790;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        div:nth-child(2) {
          width: 80vw;
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
