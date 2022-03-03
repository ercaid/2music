<template>
  <div class="home-container">
    <!-- 顶部导航条 -->
    <NavBar type="home" />
    <router-link to="/rank">排行榜</router-link>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
export default {
  name: 'HomeView',
  components: {
    NavBar
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  margin: 0 16px;
  margin-top: 56px;
  padding-bottom: 64px;
}
</style>
