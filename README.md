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
- 次に、`favicons-webpack-plugin`を使う方法で試行
  *  refer (https://github.com/jantimon/favicons-webpack-plugin)
  * ファイルコピーはできたが、コピー先のファイル名にhashの指定がないようだ
  * ⇒　faviconの生成先に`[contenthash]`で指定する
```js
  const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
...
  plugins: [
...
    new FaviconsWebpackPlugin({
      logo: './src/images/favicon.ico', // source logo (required)
      prefix: '[contenthash]/', // Prefix path for generated assets
    }), // svg works too!
  ]
```
- `html-webpack-plugin`のオプションにfaviconの指定方法も書いていた
  * refer HtmlWebpackPlugin：[Option](https://github.com/jantimon/html-webpack-plugin#options)
  * 中身は、`favicons-webpack-plugin`を利用しているようだ


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
