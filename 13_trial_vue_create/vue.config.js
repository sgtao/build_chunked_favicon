const { defineConfig } = require('@vue/cli-service')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'docs/',
  configureWebpack: {
    plugins: [
      /* config.plugin('copy') */
      new CopyPlugin({
        patterns: [
          {
            from: 'public/favicon.ico',
            to: '[name].[contenthash][ext]',
          },
        ],
      }),
    ],
  },    
})
