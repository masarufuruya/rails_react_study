# rails_react_study

## 第三回勉強会 コンポーネントを分割しよう

## 前回の勉強会
https://github.com/masarufuruya/rails_react_study/blob/master/study2.md

前回の勉強会で作った各自のブランチで作業してください

## 今回作るもの
第二回勉強会で作ったシャッフルランチと動作は変わりません。
ただ今まで1個のコンポーネントのみで作っていたものを複数のコンポーネントに分割します。

## 覚えられること
* コンポーネント内のJSXを外部ファイルからインポートする方法
* コンポーネントから別のコンポーネントを呼び出す方法
* コンポーネント間で値を受け渡しする方法
* 受け取った値を検証する方法

## 1. コンポーネント内のJSXを外部ファイルからインポートする

### JSXの外部ファイルを用意する
`frontend/src/javascripts/`にtemplateフォルダを用意し、
作成したtemplateフォルダ内に`app.jsx`を作成します。

中身は以下の内容にしてください。

```
import React from 'react'

module.exports = function() {
  return (
    <div>
      <h1>シャッフルランチ</h1>
      <button onClick={this.onClickButton}>シャッフル！</button>
      <h2>シャッフル結果</h2>
      <ul style={{listStyle: "none"}}>
        {this.listItems}
      </ul>
    </div>
  )
}
```

### app.jsのJSXを外部ファイルから読み込むように変更する

module.exportsで公開したコードは`import x from y`で読み込むことが出来ます。
xの部分の名前は自分で自由につけられますが、今回はJSXの中身なので`template`という名称にしています。

```
import template from './template/app.jsx' (追加)
import React from 'react'
import { render } from 'react-dom'
```

今までJSXを直接記述していた箇所を以下に書き換えます。

```
render() {
  this.listItems = this.state.lunchPair.map((imgUrl) =>
    <li key={imgUrl}>
      <img style={{width: 120, borderRadius: 10}} src={imgUrl}/>
    </li>
  )
  return template.call(this)
}
```

`template.call(this)`のcallはReactの機能でなく、JavaScriptの標準関数です。
template内でthisとして使われるオブジェクトを指定して呼び出す意味になります。

これにより外部ファイルへ関数や値を引き渡すことが出来ます。

### ビルドを実行する
前回の勉強会でpackage.jsonに設定した以下のコマンドを実行します。

`$ npm run watch`

```
ERROR in ./frontend/src/javascripts/template/app.jsx
Module parse failed: /Users/xxx/dev/rails_react_study/frontend/src/javascripts/template/app.jsx Unexpected token (5:4)
You may need an appropriate loader to handle this file type.
```

恐らく上記のようなエラーが表示されるはずです。

### Webpackで.jsx拡張子のファイルを読み込めるようにする
webpack.config.jsを以下のように書き換えます。

```
module: {
  loaders: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    //(以下追加)
    {
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }
  ]
}
```

.jsx拡張子のファイルを読み込むための設定です。loaderというのは対象の拡張子をwebpackに読み込む時に使われるプラグインのようなものです。

以前の勉強会で用意した`.babelrc`でreactとES6のコードを変換するためのpresetsを用意しているため、babel-loaderを指定するとjsxファイル内でもreactとES6を利用することが出来ます。

再度`npm run watch`を実行してビルドに成功すればOKです。
この状態でRailsを起動するとシャッフルランチが動作するようになっていると思います。

## 2. 別のコンポーネントに値を渡し呼び出す

### シャッフルボタン用のJSを用意する

`frontend/src/javascripts/shuffleBtn.js`を作成します。
中身は以下の内容にしてください。

```
import React from 'react'

const shuffleBtn = (props) => {
  return (
    <button onClick={props.onClickButton}>シャッフル！</button>
  )
}

module.exports = shuffleBtn
```

今回のコンポーネントのようにStateを持たないコンポーネントはStatelessComponentと
呼ばれており、ES6のクラス構文ではなくビューを返すだけの関数にすることが推奨されています。

シンプルに記述でき、状態を持つことが出来ないのでテストが書きやすくなるためです。

`props`とは別のコンポーネントから受け取ることの出来る引数のようなものです。

Reactでは子コンポーネントは親から渡されたpropsをそのまま表示するべきで、
非同期な通信を行ったり、現在時刻を取得するような実行するタイミングで内容が変わる処理を子コンポーネントで行ってはいけません。

### app.jsxから呼び出すようにする

先程作成したShuffleBtnコンポーネントをapp.jsxから呼び出すようにします。

```
import React from 'react'      
import ShuffleBtn from '../shuffleBtn' (追加)

module.exports = function() {
  return (
    <div>
      <h1>シャッフルランチ</h1>
      <ShuffleBtn onClickButton={this.onClickButton}/> (変更)
      <h2>シャッフル結果</h2>
      <ul style={{listStyle: "none"}}>
        {this.listItems}
      </ul>
    </div>
  )
}
```

`<ShuffleBtn onClickButton={this.onClickButton}/>`のように書くことでapp.jsの`onClickButton`関数がpropsとしてShuffleBtnコンポーネントに渡されます。

app.jsのonClickButton内で実際の処理の記述を書き、ShuffleBtn.jsではただユーザーがクリックしたイベントを親に渡すだけで詳しい処理は知りません。

あくまで子コンポーネントはビューのレンダリングとユーザーのイベントを親に渡す処理に専念すべきだからです。この「子供は親を知らない」はReactだけではなく、JSでモジュール分割していく上では重要な考え方です。

この状態でRailsを起動してシャッフルランチが動作するか確認しましょう。

## 3. 受け取った値を検証する

Reactではpropsの値に予期した項目が渡されているかチェックするPropTypesという方法があります。以下のようにshuffleBtn.jsを書き換えます。

```
const shuffleBtn = (props) => {
  return (
    <button onClick={props.onClickButton}>シャッフル！</button>
  )
}

//以下を追加
shuffleBtn.propTypes = {
  onClickButton: React.PropTypes.func.isRequired
}
```

次に`frontend/src/javascripts/template/app.jsx`のShuffleBtnの箇所のpropsを削除してみましょう。

```
import React from 'react'      
import ShuffleBtn from '../shuffleBtn' (追加)

module.exports = function() {
  ...(中略)
  return (
    <div>
      <h1>シャッフルランチ</h1>
      <ShuffleBtn/> (変更)
      <h2>シャッフル結果</h2>
      <ul style={{listStyle: "none"}}>
        {this.listItems}
      </ul>
    </div>
  )
}
```

この状態でRailsサーバーにアクセスすると以下のJSエラーが表示されるはずです。

```
Warning: Failed prop type: The prop `onClickButton` is marked as required in `shuffleBtn`, but its value is `undefined`.
    in shuffleBtn (created by SampleApp)
    in SampleApp
```

このようにPropsの抜け漏れや型チェックが出来るので、Propsを受け取るコンポーネントの場合は必ずPropsTypeを書くようにしましょう。

ちなみに以下のエラーも出ているかもしれませんが、これは現在の最新版であるReact15.5系から表示されるようになった警告です。

```
Warning: Accessing PropTypes via the main React package is deprecated. Use the prop-types package from npm instead.
```

今までReactに同梱されていたPropTypesが、prop-typesという別のnpmに分離されるので非推奨ですという意味です。

React16系へのメジャーアップデートまでには対応が必要なので、現在15.3系を利用しているベストティーチャー本体側も追々対応する予定ですが、勉強会では無視してOKです。

## 4. リスト部分をコンポーネントに分割してみよう

残りの時間は今日学んだ内容を元にシャッフル結果のリスト部分を自分で別のコンポーネントに分割して動かしてみましょう！
