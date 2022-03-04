import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/rank',
    name: 'rank',
    component: () => import('../views/RankView.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/SearchView.vue')
  },
  {
    path: '/list/:id',
    name: 'list',
    component: () => import('../views/ListView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
