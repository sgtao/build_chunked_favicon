const { defineConfig } = require('@vue/cli-service')
// 
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'docs/',
  chainWebpack: (config) => {
    //* HTMLの設定 *//
    config
      .plugin('html')
      // .use('html-webpack-plugin')
      .tap(args => {
        args[0].template = 'public/index.html'
        args[0].favicon = 'public/favicon.ico'
        args[0].hash = true
        return args
      })
    },
})
