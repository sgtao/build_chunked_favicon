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
  * `copy-webpack-plugin`を使った方法で失敗。上手く実装できなかった。（`HookWebpackError: Invalid host defined options`）
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

