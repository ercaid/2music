import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import { login } from '../common/neteaseApi'
import { setTokenTime } from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    songId: 0,
    playList: [],
    userinfo: JSON.parse(localStorage.getItem('userinfo')) || {},
    cookie: localStorage.getItem('cookie') || ''
  },
  getters: {
    cookie: (state) => state.cookie
  },
  mutations: {
    setUserinfo(state, userinfo) {
      state.userinfo = userinfo
      localStorage.setItem('userinfo', JSON.stringify(userinfo))
    },
    setCookie(state, cookie) {
      state.cookie = cookie
      localStorage.setItem('cookie', cookie)
    },
    SET_ID(state, payload) {
      state.songId = payload
    },
    INIT_List(state, payload) {
      state.playList = payload
    },
    SET_LOGIN(state, payload) {
      state.userinfo.islogin = payload.islogin
      state.userinfo.name = payload.name
      state.userinfo.picurl = payload.picurl
    }
  },
  actions: {
    // 1. 值为一个对象，包含多个响应用户动作的回调函数
    // 2. 通过 commit()来触发 mutation 中函数的调用, 间接更新 state
    login({ commit }, userinfo) {
      return new Promise((resolve, reject) => {
        login(userinfo.phone, userinfo.password)
          .then((res) => {
            commit('setCookie', res.data.cookie)
            commit('setUserinfo', { name: res.data.profile.nickname, picurl: res.data.profile.avatarUrl })
            setTokenTime()
            // 重定向至首页
            router.replace('/')
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    logout({ commit }) {
      commit('setCookie', '')
      commit('setUserinfo', '')
      localStorage.removeItem('cookie')
      localStorage.removeItem('userinfo')
    }
  }
})
