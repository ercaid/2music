import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// 全局过滤器
Vue.filter('formatCount', (value) => {
  if (value >= 10000 && value <= 100000000) {
    value /= 10000
    return value.toFixed(1) + '万'
  } else if (value > 100000000) {
    value /= 100000000
    return value.toFixed(1) + '亿'
  } else {
    return value
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
