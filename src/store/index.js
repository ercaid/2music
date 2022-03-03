import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    songId: 0,
    playList: []
  },
  getters: {},
  mutations: {
    SET_ID(state, payload) {
      state.songId = payload
    },
    INIT_List(state, payload) {
      state.playList = payload
    }
  },
  actions: {},
  modules: {}
})
