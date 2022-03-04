<template>
  <div class="search-container">
    <!-- 顶部导航条 -->
    <NavBar type="search" @searchWord="handleSearch" @suggest="handleSuggest" :searchWord="searchWord" />
    <!-- 选择搜索目标 -->

    <!-- 历史记录和热搜区 -->
    <div v-show="searchType === 1">
      <!-- 历史记录 -->
      <div class="search-history" v-if="searchHistory.length > 0">
        <div class="head">
          <span>历史记录</span>
          <v-icon size="16" color="#b2b2b2" @click="handleToClear">mdi-trash-can-outline</v-icon>
        </div>
        <div class="search-history-list">
          <div v-for="(item, index) in searchHistory" :key="index" @click="handleChangeWord(item)">{{ item }}</div>
        </div>
      </div>
      <!-- 热搜榜 -->
      <div class="search-hot">
        <div class="head">
          <div>热搜榜</div>
        </div>
        <div class="search-hot-item" v-for="(item, index) in searchHot" :key="index" @click="handleChangeWord(item.searchWord)">
          <div class="search-hot-index" :class="{ hot: index < 3 }">{{ index + 1 }}</div>
          <div class="search-hot-word">
            <div>
              {{ item.searchWord }}
              <img v-if="item.iconUrl" :src="item.iconUrl" />
            </div>
            <div>{{ item.content }}</div>
          </div>
          <div class="search-hot-count">{{ item.score }}</div>
        </div>
      </div>
    </div>

    <!-- 搜索建议 -->
    <div v-show="searchType === 2">
      <div class="search-suggest">
        <div class="top" v-if="this.searchWord !== ''">搜索“{{ searchWord }}”</div>
        <div class="item" v-for="(item, index) in searchSuggest" :key="index" @click="handleSearch(item.keyword)">
          <v-icon size="18" color="#959595">mdi-magnify</v-icon>
          <span>{{ item.keyword }}</span>
        </div>
      </div>
    </div>

    <!-- 搜索列表 -->
    <div v-show="searchType === 3">
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
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import { searchHot, searchSuggest, searchWord } from '@/common/neteaseApi.js'
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
      searchSuggest: []
    }
  },
  async created() {
    const res = await searchHot()
    if (res.data.code === 200) {
      this.searchHot = res.data.data
    }
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
          this.searchType = 2
        }
      }
    },
    // 播放搜索歌曲
    handleToPlay(id) {
      this.$store.commit('SET_ID', id)
    },
    async getSearchList(word) {
      const res = await searchWord(word)
      if (res.data.code === 200) {
        // 默认前30首歌
        this.searchList = res.data.result.songs
        this.searchType = 3
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
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  margin: 0 16px;
  margin-top: 60px;
  padding-bottom: 64px;

  .search-history {
    font-size: 13px;
    color: #000;

    .head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 9px;
      font-weight: 600;
    }

    .search-history-list {
      display: flex;
      flex-wrap: wrap;

      div {
        border-radius: 20px;
        padding: 4px 10px;
        background-color: #f7f7f7;
        margin: 0 8px 8px 8px;
        overflow: hidden;
      }
    }
  }

  .search-hot {
    margin-top: 15px;
    font-size: 13px;
    color: #000;

    .head {
      margin-bottom: 9px;
      font-weight: 600;
    }

    .search-hot-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;

      .search-hot-index {
        width: 30px;
        margin-left: 4px;
      }

      .hot {
        color: #fb2222;
      }

      .search-hot-word {
        font-size: 15px;
        width: 65vw;

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
        position: absolute;
        right: 20px;
        color: #878787;
      }
    }
  }

  .search-suggest {
    font-size: 13px;

    .top {
      color: #4574a5;
      margin-bottom: 30px;
    }
    .item {
      display: flex;
      align-items: center;

      span {
        margin-left: 10px;
        padding: 10px 0;
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
          font-size: 14px;
          color: #235790;
          margin-bottom: 6px;
        }

        div:nth-child(2) {
          width: 70vw;
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
