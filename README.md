# build_chunked_favicon
- faviconの画像をchunk付きで生成してみる
  * webpackでの試行
  * create-react-appでの試行
  * vue-cli create での試行
  * create-vue での試行　　などを試してみる

## 背景
- ネット記事で、webpackの画像ファイルのchunk付与はとりあげてるけど、`favicon.ico`ファイルをchunkする記事は見かけていない
  * 制約があるから記事化されていない可能性はあるが、実装できるか試してみる

### 参考情報
- Udemy、CodeMafia『【CodeMafia】Webpack環境構築入門』
  * 試行計画：基本は、NPMの`file-loader`モジュールを使って、オプションに`name: '[contenthash].[ext]',` を付与する方法で実装してみる


## １．webpackでの試行
- 当初、`file-loader`の対象に`ico`ファイルをつければよいと思ったが、上手くいかない。
  * `file-loader`の拡張子に"ico"を追加しても反応しない。
  * 画像ファイルではないからか？
  * 明示的にファイル複製にしようと、`copy-webpack-plugin`を使ってみたが、失敗
    + （スキル不足で）上手く実装できなかった。（`HookWebpackError: Invalid host defined options`）
- `html-webpack-plugin`を使い、オプションの`favicon`と`hash`を利用するのが手軽だった
```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
//
module.exports = {
  // プロパティを定義する
  mode: "production",
....
  plugins: [
....
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
      favicon: 'src/images/favicon.ico', // faviconはwebpackで指定する(ソースは削除)※
      hash: true, // This is useful for cache busting
    }),
  ],
};
```
  * webpackでfaviconを指定するので、src(`src/index.html`)側ではfaviconの指定を外す
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>trial webpack</title>
  <!-- <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon"> -->
</head>
```

## ２．create-react-appでの試行
- `create-react-app`コマンドでReact開発環境を作成した場合、webpackの環境設定ファイルは表にはみえなかった
  * webpackでビルドするため、追加でwebpack-cliを追加して、package.jsonを書き換える方法を参考にする
  * refer ICS-mediaサイト：https://ics.media/entry/16329/#webpack-ts-react
  * refer Zennブログ：https://zenn.dev/hrkmtsmt/articles/93653309e2a13d

### 手順：
1. ICS-mediaさんのサンプルソースから編集
2. `webpack`関連のパッケージを追加：
```shell
npm i
npm i -D html-loader
npm i -D html-webpack-plugin
npm i rimraf --save
```
3. htmlを`src/index.html`からコピーするようにして、`html-loader`を利用する
  * 併せて、faviconも指定して、**hash=true**にする
  * `webpack.config.js`の追記
```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
//
module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "production",
  //
...
  module: {
    rules: [
...
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
    ],
  },
...
  // pluginの設定
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
      favicon: 'src/logo.svg', // faviconはwebpackで指定する(ソースは削除)
      hash: true, // This is useful for cache busting
    }),
  ],
};
```

## ３．vue-cli createでの試行
- `vue create`で作ったアプリで確認してみる
  * Vue3の標準設定のアプリとする。
  * Vue/CLI v5を利用することで、`vue.config.js`を作成する
- 手順１．まず、`favicons-webpack-plugin`をインストール
```shell
npm i favicons-webpack-plugin --save-dev
```
- 手順２．`vue.config.js`ファイルを編集
```js
 const { defineConfig } = require('@vue/cli-service')
+const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
 module.exports = defineConfig({
   transpileDependencies: true,
   outputDir: 'docs/',
+  configureWebpack: {
+    plugins: [
+      new FaviconsWebpackPlugin({
+        logo: './public/favicon.ico', // source logo (required)
+        prefix: '[contenthash]/', // Prefix path for generated assets
+      }),
+    ],
+  },
 })
 ```
- 手順３．`vue inspect`で確認：失敗？
  * `FaviconWebpackPlugin`が現れない。手順２が誤り？
- 手順４．`npm run build`してみる：TypeError（faviconの設定が邪魔をしていた）
```
?  Building for production...
    const { html: tags, images, files } = await favicons(logoSource, {
                                                ^
TypeError: favicons is not a function
```
- 追記分の設定を外してビルド：成功

### 代替案：Vueですでに使っているPlug-Inないで設定追加
- `vue inpspect`を見ると、**CopyPlugin**をすでに利用しているようなので、ここに設定を追加する案
```js
    new CopyPlugin(
      {
        patterns: [
          {
            from: '.../13_trial_vue_create/public',
            to: '.../13_trial_vue_create/docs',
            toType: 'dir',
            noErrorOnMissing: true,
            globOptions: {
              ignore: [
                '**/.DS_Store',
                '.../13_trial_vue_create/public/index.html'
              ]
            },
            info: {
              minimized: true
            }
          }
        ]
      }
    ),
```
