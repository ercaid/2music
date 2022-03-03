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
