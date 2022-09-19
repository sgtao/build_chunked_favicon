const { defineConfig } = require('@vue/cli-service')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'docs/',
})
