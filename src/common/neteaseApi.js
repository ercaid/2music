import { baseNeteaseUrl as baseUrl } from './config.js'
import axios from 'axios'

const request = axios.create({
  baseURL: baseUrl,
  timeout: 5000
})

// 获取榜单列表摘要
export const topList = () => {
  return request({
    url: '/toplist/detail'
  })
}

// 获取歌单详情
export const listDetail = (id) => {
  return request({
    url: '/playlist/detail',
    params: {
      id: id
    }
  })
}

// 获取歌曲详情
export const songDetail = (ids) => {
  return request({
    url: '/song/detail',
    params: {
      ids: ids
    }
  })
}

// 获取歌曲链接
export const songUrl = (id) => {
  return request({
    url: '/song/url',
    params: {
      id: id
    }
  })
}

// 获取歌词
export const songLyric = (id) => {
  return request({
    url: '/lyric',
    params: {
      id: id
    }
  })
}

// 获取轮播图
export const banner = () => {
  return request({
    url: '/banner?type=1'
  })
}

// 获取热搜榜
export const searchHot = () => {
  return request({
    url: '/search/hot/detail'
  })
}

// 获取搜索结果
export const searchWord = (keywords) => {
  return request({
    url: 'search',
    params: {
      keywords: keywords
    }
  })
}

// 下拉提示
export const searchSuggest = (keywords) => {
  return request({
    url: '/search/suggest',
    params: {
      keywords: keywords,
      type: 'mobile'
    }
  })
}

// 获取每日推荐歌单
export const suggestList = () => {
  return request({
    url: '/personalized?limit=9'
  })
}
