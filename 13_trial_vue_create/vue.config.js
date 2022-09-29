const { defineConfig } = require('@vue/cli-service')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'docs/',
  configureWebpack: {
    // chainWebpack: config => {
    //   // dist のindex.htmlが重複して吐き出されないようしている。
    //   config
    //     .plugin('copy')
    //     .uses.clear()
    // },
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
      /* config.plugin('html') */
      // new HtmlWebpackPlugin({
      //   template: "./public/index.html",
      //   inject: "body",
      //   favicon: 'public/images/favicon.ico', // faviconはwebpackで指定する(ソースは削除)※
      //   hash: true, // This is useful for cache busting
      // }),
    ],
  },    
})
