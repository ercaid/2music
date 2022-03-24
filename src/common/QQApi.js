import { baseQQUrl as baseUrl } from './config.js'
import axios from 'axios'

const request = axios.create({
  baseURL: baseUrl,
  timeout: 5000
})

// 获取搜索列表
export const searchWordQQ = (key) => {
  return request({
    url: '/search',
    params: {
      key: key
    }
  })
}

// 获取歌曲详情
export const songDetailQQ = (songmid) => {
  return request({
    url: '/song',
    params: {
      songmid: songmid
    }
  })
}

// 获取歌曲链接
export const songUrlQQ = (id) => {
  return request({
    url: '/song/url',
    params: {
      id: id
    }
  })
}

// 获取歌词
export const songLyricQQ = (songmid) => {
  return request({
    url: '/lyric',
    params: {
      songmid: songmid
    }
  })
}
