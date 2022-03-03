import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    songId: 0
  },
  getters: {},
  mutations: {
    SET_ID(state, payload) {
      state.songId = payload
    }
  },
  actions: {},
  modules: {}
})
