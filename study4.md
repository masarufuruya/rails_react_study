# 第四回勉強会 非同期通信とタイマーを実装しよう

## 前回の勉強会
https://github.com/masarufuruya/rails_react_study/blob/master/study3.md

前回の勉強会で作った各自のブランチで作業してください

## 今回作るもの
https://gyazo.com/3f356c38c43586378804c13a2985ddae

tiqavのAPIを使ってネタ画像をランダムに取得して表示するツールを作ります。
10秒置きに画像は再ロードされます。

## 覚えられること
* 非同期通信を実装する方法
* タイマーを設定する方法

## masterブランチへ移動してPull

```
$ git checkout master
$ git pull origin master
```

## 作業ブランチを作成
今回は前回まで作っていたシャッフルランチとは別のブランチを作成します。
以下のブランチを作成してください。

```
$ git checkout -b [名前]_study4
```

## 1. 親のコンポーネントを用意する

### ビルドコマンドを実行しておく

ビルドのコマンドは先に実行しておきましょう。
既にmasterブランチでpackage.jsonに設定しているのですぐに以下のコマンドが実行できます。

```
$ npm run watch
```

### stateを設定する

状態としては画像の一覧があれば良いので、以下のように`frontend/src/javascripts/app.js`を書き換えます。

```
class SampleApp extends React.Component {
  constructor() {
  	//以下に変更
    super()
    this.state = {
      images: []
    }
  }
}
```

### JSXを用意する

まずは動作確認用にJSXとrenderを用意します。

```
class SampleApp extends React.Component {
  constructor() {
    super()
    this.state = {
      images: []
    }
  }
  //追加
  render() {
    return (
      <div>
        <h1>ネタ画像検索</h1>
        //画像検索結果のコンポーネントを別に置く
      </div>
    )
  }
}

//追加
const elem = React.createElement(SampleApp)
render(elem, document.getElementById('sample'))
```

Railsを起動して以下の画面になればOKです。
![RailsReactStudy.png](https://qiita-image-store.s3.amazonaws.com/0/33823/ac289d5a-bfeb-fc12-e80c-7981eefaeafd.png "RailsReactStudy.png")

## 2. 子コンポーネントを用意する

具体的な機能を実装する前に次に子コンポーネントを用意します。

### 画像一覧用のコンポーネント(SearchImages.js)を作成

`frontend/src/javascripts/SearchImages.js`を作成し、内容は以下のようにします。

```
import React from 'react'

const SearchImages = () => {
  //ここにJSXを書く
}

SearchImages.propTypes = {
 images: React.PropTypes.array.isRequired
}

module.exports = SearchImages
```

まずは親コンポーネントから何をpropsで受け取るかを決め、propTypesで定義します。

画像一覧コンポーネントは親から一覧の配列を受け取り、それをさらに画像用のコンポーネントに渡するので受け取るpropsはimagesのみです。

### 画像用のコンポーネント(SearchImage.js)を作成

`frontend/src/javascripts/SearchImage.js`を作成し、内容は以下のようにします。

```
import React from 'react'

const SearchImage = () => {
  //ここにJSXを書く
}

SearchImage.propTypes = {
  imgUrl: React.PropTypes.string.isRequired
}

module.exports = SearchImage
```

画像用のコンポーネントでは画像パスを元にimgタグを表示するので画像URLをpropsとして受け取ります。

### 画像用のコンポーネント(SearchImage.js)のJSXを用意

以下のようにJSXを記述します。

```
const SearchImage = (props) => {
  return (
    <img className="copy" src={props.imgUrl}/>
  )
}
```

propsを受け取るので、(props)に書き換え、画像パスをpropsで受け取ります。
クラス名は今後の実装で必要になるのでつけています。

### 画像一覧用のコンポーネント(SearchImages.js)のJSXを用意

以下のようにJSXを記述します。

```
const SearchImages = (props) => {
  return (
    <div>
      {props.images}
    </div>
  )
}
```

StatelessComponentではビュー以外の処理を書くべきではないので、
`map`で画像用コンポーネントの配列を生成する処理は親コンポーネントで行い、
それをpropsで受け取るようにしています。

## 3. 親コンポーネントで必要な配列データを用意

子コンポーネントのpropsを指定してから、次に親から必要な要素を渡すようにしていきます。

### stateに仮の配列データを設定する

`frontend/src/javascripts/App.js`のstateに仮の配列を設定します。

```
constructor() {
  super()
  //stateを修正
  this.state = {
    images: [{
    	id: 1,
    	imgUrl: 'http://img.tiqav.com/2yS.jpg'
    }, {
    	id: 2,
    	imgUrl: 'http://img.tiqav.com/2yS.jpg'
    }]
  }
}
```

### 画像用一覧用のコンポーネントを出力

次にrender内を以下のコードに書き換えます。

```
render() {
  const images = this.state.images.map((image) => {
    return <SearchImage key={image.id} imgUrl={image.imgUrl}/>
  })
  return (
    <div>
      <h1>ネタ画像検索</h1>
      <SearchImages images={images}/>
    </div>
  )
}
```

また忘れずにコンポーネントのインポートを行うようにしましょう。

```
import SearchImages from './SearchImages'
import SearchImage from './SearchImage'
```

2の子コンポーネントを用意するで設定したpropTypesを確認しつつ、必要な値を渡して`SearchImage`,`SearchImages`コンポーネントを出力するようにしています。

Railsを起動して以下の見た目になっていればOK。

![RailsReactStudy.png](https://qiita-image-store.s3.amazonaws.com/0/33823/125187bc-3a71-da71-343e-9172893a56b1.png "RailsReactStudy.png")


## 4. 非同期通信で配列データを取得する

### HTTPクライアントライブラリのaxiosをインストール
以下のコマンドでインストールします。

`$ npm i axios --save`

AjaxのためだけにJQuery使いたくないのと、プロミスが使えるので
入れておくと後々便利なので、axiosを使うようにしています。

## コンポーネントの出力時に非同期通信を実行するようにする

### 非同期処理用の関数を追加

`frontend/src/javascripts/App.js`に以下の関数を追加します。

```
fetchRandomTiqavImages(callback) {
  axios.get('/samples/fetch_random_tiqav_images')
  .then((response) => {
    return callback({status: 'success', response: response.data})
  }).catch(() => {
    return callback({status: 'error'})
  })
}
```

### componentDidMountを追加

`frontend/src/javascripts/App.js`のrenderの下に以下のコードを追加します

```
render() {
  ...省略
}
componentDidMount() {
  this.fetchRandomTiqavImages((data) => {
    this.setState({
      images: data.response
    })
  })
}
```

componentDidMountとはReactコンポーネントがDOMに追加された後にコールバックで呼ばれる
Reactが用意しているメソッドです。

コンポーネントのライフサイクルと呼ばれる仕組みで、以下の記事が詳しいです。
React.jsのComponent Lifecycle - Qiita http://qiita.com/koba04/items/66e9c5be8f2e31f28461

ちなみにライフサイクルはES6のクラスを使ったClassComponentのみ存在し、
StatelessComponentでは使えません。

Railsを実行して以下のようにランダムが画像が表示されればOKです。

![RailsReactStudy.png](https://qiita-image-store.s3.amazonaws.com/0/33823/c8b1fc83-c81a-3225-b053-1c4e1262de0d.png "RailsReactStudy.png")

## 5. タイマーをセットして10秒毎に画像が変わるようにする

### タイマーを設定する

`frontend/src/javascripts/App.js`に以下の関数を追加します。
10秒毎に非同期通信を実行し、stateを更新する処理です。

```
startFetchImagesTimer() {
  this.fetchImagesTimer = setInterval(() => {
    this.fetchRandomTiqavImages((data) => {
      this.setState({
        images: data.response
      })
    })
  }, 10000)
}
```

先程追加したcomponentDidMountの中でタイマーをセットします。
Reactでは非同期通信とタイマー処理といった初期化処理はcomponentDidMountに記述するのが普通です。

```
componentDidMount() {
  this.fetchRandomTiqavImages((data) => {
    this.setState({
      images: data.response
    })
  })
  //以下を追加
  this.startFetchImagesTimer()
}
```

### コンポーネント削除時にタイマーも削除する

`frontend/src/javascripts/App.js`に以下の関数を追加します。

```
componentWillUnmount() {
  clearInterval(this.startFetchImagesTimer)
}
```

componentWillUnmountはコンポーネントがDOMから削除された時に呼ばれるメソッドで、
設定したタイマーはこちらで解除するようにしておく必要があります。

この状態でRailsを起動して以下のように10秒毎に画像が変わればOKです。

https://gyazo.com/3f356c38c43586378804c13a2985ddae

## 6. 画像をクリックしたらクリップボードにコピーされるようにする

clipboardというnpmを使うと簡単に実装できるので、
自分で作ってみてください！

## 7. 入力したテキストで検索した結果を表示するようにする。

今はランダムで画像を表示しているだけですが、自分で入力したテキストを元に検索結果を表示するようにしてみましょう！

