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

## コンポーネント内のJSXを外部ファイルからインポートする

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
        {listItems}
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
  ...(中略)
  return template.call(this) (追加)
}
```
