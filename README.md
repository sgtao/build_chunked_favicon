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
- VueCLIの[The internal webpack configのメモ](https://cli.vuejs.org/guide/webpack.html#chaining-advanced)


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
1. まず、`vue inspect`でHTML-pluginの状態を確認
```shell
# vue inspect
# vue inspect --plugin html
(cd 13_trial_vue_create/; vue inspect --plugin html)
/* config.plugin('html') */
new HtmlWebpackPlugin(
  {
    title: '13_trial_vue_create',
    scriptLoading: 'defer',
    templateParameters: function () { /* omitted long function */ },
    template: '...'
  }
)
```
2. `vue.config.js`で[Pluginの設定変更](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-plugin)を適用
```js
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
 ```
3. `vue inspect`で再確認：成功
```shell
 (cd 13_trial_vue_create/; vue inspect --plugin html)
/* config.plugin('html') */
new HtmlWebpackPlugin(
  {
    title: '13_trial_vue_create',
    scriptLoading: 'defer',
    templateParameters: function () { /* omitted long function */ },
    template: 'public/index.html',
    favicon: 'public/favicon.ico',
    hash: true
  }
)
$
```
4. `public/index.html`のfavicon.ico参照部分をコメントアウト
```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <!-- <link rel="icon" href="<%= BASE_URL %>favicon.ico"> -->
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
```
5. `npm run build`実行

