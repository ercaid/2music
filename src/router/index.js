import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// 解决 Uncaught (in promise) Error:
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}

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
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/daily',
    name: 'daily',
    component: () => import('../views/DailyView.vue')
  }
]

const router = new VueRouter({
  routes
})

// 黑名单
const blackList = ['/daily']

// 导航守卫
router.beforeEach((to, from, next) => {
  if (store.getters.cookie) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (blackList.includes(to.path)) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
