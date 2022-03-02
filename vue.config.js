const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 解决打包后页面空白的问题
  publicPath: './',
  transpileDependencies: ['vuetify']
})
