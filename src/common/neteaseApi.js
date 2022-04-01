import { baseNeteaseUrl as baseUrl } from './config.js'
import axios from 'axios'
import store from '@/store'
import { diffTokenTime } from '../utils/auth'

const request = axios.create({
  baseURL: baseUrl,
  timeout: 5000
})

// 请求拦截器
// 为每个请求添加上 cookie 信息
request.interceptors.request.use(
  (config) => {
    if (localStorage.getItem('cookie')) {
      if (diffTokenTime()) {
        store.dispatch('logout')
        return Promise.reject(new Error('cookie 失效了'))
      }
    }
    config.params = {
      ...config.params,
      cookie: localStorage.getItem('cookie')
    }
    return config
  },
  (error) => {
    return Promise.reject(new Error(error))
  }
)

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
    url: '/search',
    params: {
      keywords: keywords,
      limit: 100
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

// 获取每日推荐歌单
export const dailyList = () => {
  return request({
    url: '/recommend/resource'
  })
}

// 登录
export const login = (phone, password) => {
  return request({
    url: '/login/cellphone',
    params: {
      phone: phone,
      password: password
    }
  })
}

// 登录状态
export const loginState = () => {
  return request({
    url: '/login/status'
  })
}

// 退出登录
export const logout = () => {
  return request({
    url: '/logout'
  })
}

// 每日推荐
export const dailySong = () => {
  return request({
    url: '/recommend/songs'
  })
}
