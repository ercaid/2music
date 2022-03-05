import { baseQQUrl as baseUrl } from './config.js'
import axios from 'axios'

const request = axios.create({
  baseURL: baseUrl,
  timeout: 5000
})

// 获取搜索列表
export const searchWord = (key) => {
  return request({
    url: '/search',
    params: {
      key: key
    }
  })
}
