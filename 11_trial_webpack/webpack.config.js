// CommonJs style
// - module.exports = {...} にルールを記述する
//   * 似たようなものにES6から、import/exportというのがある
// 実行方法は：
//   yarn run webpack
//
const path = require("path"); // output で相対パスにするために読込
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
//
// prepare short-hash as function
// 一番上の行あたりに記述
const shorthash = Math.random().toString(36).slice(-5);
//
module.exports = {
  // プロパティを定義する
  mode: "production",
  // devtool: 'none', // これは使えないようだ
  // devtool: 'inline-source-map', // distが暗号化される
  // entry: ['./src/app.js', './src/sub.js']
  entry: { app: "./src/app.js" },
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          "css-loader",
          "postcss-loader", // 追加
          "sass-loader",
        ],
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff2?|tff|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              // name: '[name].[ext]',
              name: "[contenthash].[ext]",
              outputPath: "images",
              publicPath: "images",
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name].css`,
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
      favicon: 'src/images/favicon.ico', // faviconはwebpackで指定する(ソースは削除)
      hash: true, // This is useful for cache busting
    }),
  ],
};
