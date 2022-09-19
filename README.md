# build_chunked_favicon
- faviconの画像をchunk付きで生成してみる
  * webpackでの試行
  * create-react-appでの試行
  * vue-cli create での試行
  * create-vue-app での試行　　などを試してみる

## 背景
- ネット記事で、webpackの画像ファイルのchunk付与はとりあげてるけど、`favicon.ico`ファイルをchunkする記事は見かけていない
  * 制約があるから記事化されていない可能性はあるが、実装できるか試してみる

### 参考情報
- Udemy、CodeMafia『【CodeMafia】Webpack環境構築入門』
  * 試行計画：基本は、NPMの`file-loader`モジュールを使って、オプションに`name: '[contenthash].[ext]',` を付与する方法で実装してみる


## １．webpackでの試行
- 当初、`file-loader`の対象に`ico`ファイルをつければよいと思ったが、上手くいかない。
- `copy-webpack-plugin`を使った方法を試してみる
  * QAサイト"[How do I get favicon working with webpack](https://discourse.aurelia.io/t/how-do-i-get-favicon-working-with-webpack/3600)"で紹介されていた方法を試してみる
    + 参考webpack: https://webpack.js.org/plugins/copy-webpack-plugin/
  * ⇒失敗。上手く実装できなかった。（`HookWebpackError: Invalid host defined options`）
```js
  const CopyWebpackPlugin = require('copy-webpack-plugin')
...
  plugins: [
...
    new CopyWebpackPlugin ({
      patterns: [
        {
          context: "src",
          from: "images/favicon.ico",
          to: path.resolve(__dirname, "./docs/images/")
        }
      ],
    }),
```
- `html-webpack-plugin`のオプションにfaviconの指定方法も書いていた
  * refer HtmlWebpackPlugin：[Option](https://github.com/jantimon/html-webpack-plugin#options)
  * refer (https://github.com/jantimon/favicons-webpack-plugin)
```js
  const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
...
  plugins: [
    new FaviconsWebpackPlugin('/path/to/logo.png') // svg works too!
  ]
```
