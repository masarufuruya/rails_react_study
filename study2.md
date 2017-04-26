# rails_react_study
Rails+WebpackでReactを使った開発を始めるための勉強用リポジトリ

## 今回作るもの
![a71f4dc9e019b67d872587c1be6d4909.gif](https://qiita-image-store.s3.amazonaws.com/0/33823/69f8ab1a-4b73-f711-9245-bbd833bec4ae.gif "a71f4dc9e019b67d872587c1be6d4909.gif")

## 覚えられること
* JSX内のイベントをハンドリングする方法
* Stateを使ってReactコンポーネント内で状態を保持する方法
* Reactで配列データからリストを作成する方法
* Stateを更新して再レンダリングさせる方法

## 前回の勉強会
https://github.com/masarufuruya/rails_react_study/blob/master/study1.md

前回の勉強会で作った各自のブランチで作業してください

## `webpack -w`をnpmコマンドに登録する

```
$ ./node_modules/.bin/webpack -w
```

```
"scripts": {
  "watch": "webpack -w", //これを追加
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

* 以下のコマンドで常にファイルの変更を監視してくれるようになる
* package.jsonに記述するとパスを良きように解決してくれるので、CIで実行する時もnpmのコマンドとして実行するのが一般的

```
$ npm run watch
```

## JSXを用意する

* `frontend/src/javascripts/app.js`を修正
* render内を以下のコードに変更する

```
render() {
  return (
    <div>
      <h1>シャッフルランチ</h1>
      <button>シャッフル！</button>
      <h2>シャッフル結果</h2>
      <ul>
      </ul>
    </div>
  )
}
```

以下の表示になればOK

![RailsReactStudy.png](https://qiita-image-store.s3.amazonaws.com/0/33823/f74a20ec-9f03-588d-afc6-5e77d86f398c.png "RailsReactStudy.png")

## Reactでクリックイベントを受け取る
以下のコードに修正

```
render() {
  return (
  ...
  <button onClick={this.onClickButton}>シャッフル！</button>
  ...
  )
}
onClickButton() {
  alert('click')
}
```

ボタンをクリックしてアラートを表示できることを確認する

Reactでイベントハンドリングできる一覧はこちらを参照
https://facebook.github.io/react/docs/events.html#supported-events

{}はJSX内でJavaScriptのコードを書くことが出来るReactの文法

## Stateで状態を保持する
* frontend/src/javascripts/app.jsを修正
* 以下のconstructorの部分を追加する
* onClickButtonでstateの中身をアラートを出すようにする

```
class SampleApp extends React.Component {
  constructor() {
    super()
    this.state = {
      members: [
        'https://scontent.xx.fbcdn.net/v/t1.0-9/10398856_961557890590812_5367309510057063574_n.jpg?oh=1115c2533c2c2aa8bb49e7462bba7530&oe=5975AB02',
        'https://scontent.xx.fbcdn.net/v/t1.0-1/c12.12.155.155/150497_109074259254709_1577858473_n.jpg?oh=96e0b7a0a54f2581ddf0472a8f29ca23&oe=59C2BA7F',
        'https://scontent.xx.fbcdn.net/v/t1.0-1/p160x160/10409197_760558674041065_6413783296232701181_n.jpg?oh=c4a5743a8b354945de2ab86c63f54895&oe=597E2513',
        'https://scontent.xx.fbcdn.net/v/t1.0-1/c0.0.160.160/p160x160/13507250_1098841713528589_1463668024516927042_n.jpg?oh=aae631f21bd3f2b5277fade0616dc6fb&oe=598C4C65',
        'https://scontent.xx.fbcdn.net/v/t1.0-1/c17.0.320.320/p320x320/319475_288581477916654_1670364288_n.jpg?oh=b6c643665fa0656414db55f691ea99a7&oe=5981D773'
      ],
      lunchPair: []
    }
    this.onClickButton = this.onClickButton.bind(this)
  }
  ...
  onClickButton() {
    alert(this.state.members[0])
  }
```

membersの1個目の画像URLが表示されればOK

```
this.onClickButton = this.onClickButton.bind(this)
```

上記の箇所はES6でイベントハンドラ内でthisを使うのに必要な記述。
詳細は以下の記事を参考
https://facebook.github.io/react/docs/handling-events.html


## Reactでリストを作成する

renderの中を以下のコードに修正します

```
render() {
  const listItems = this.state.members.map((imgUrl) =>
    <li key={imgUrl}>
      <img style={{width: 120, borderRadius: 10}} src={imgUrl}/>
    </li>
  )
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

次のコードはmembersの配列をループして人数分のリストのJSX配列に作り変えて返す処理です。

key属性は変更のあったDOMを高速に判定するために、一意な値を指定します。
今回の例ではimgUrlにしてますが、本来はDBテーブルのプライマリーキーが好ましいと思います。

```
const listItems = this.state.members.map((imgUrl) =>
  <li key={imgUrl}>
    <img style={{width: 120, borderRadius: 10}} src={imgUrl}/>
  </li>
);
```

ちなみにReactでstyle属性を指定する時はCSS文字列ではなく、JSのオブジェクトで書きます。
https://facebook.github.io/react/docs/dom-elements.html

人数分の画像が表示されればOKです

![RailsReactStudy.png](https://qiita-image-store.s3.amazonaws.com/0/33823/e36dd675-dcf3-70a6-65f8-81cdd1257040.png "RailsReactStudy.png")

## シャッフルした結果でStateを更新する

`getRandomMember`メソッドを追加し、`onClickButton`を以下のコードに書き換える

```
onClickButton() {
  //3人1組をランダムで選ぶ
  let pairArray = []
  while (pairArray.length < 3) {
    let value = this.getRandomMember()
    if (pairArray.indexOf(value) >= 0) {
      continue
    }
    pairArray.push(value)
  }
  //Stateのペア数を更新する
  this.setState({
    lunchPair: pairArray
  })
}
//メンバーの中からランダムで1人選ぶ
getRandomMember() {
  const members = this.state.members
  return members[Math.floor(Math.random() * members.length)]
}
```

ReactではStateを更新する時は`this.state`を直接書き換えるのではなく、
`this.setState`で更新したいオブジェクトのみ更新するようにする。

## シャッフル結果を元にリストを表示するように修正する

```
render() {
  const listItems = this.state.lunchPair.map((imgUrl) =>
    <li key={imgUrl}>
      <img style={{width: 120, borderRadius: 10}} src={imgUrl}/>
    </li>
  );
  ...
```

`this.state.members.map`になっていた箇所を`this.state.lunchPair.map`に書き換えてシャッフル結果を元にリストを表示する

最終的に以下の動作をしていれば完成です

![a71f4dc9e019b67d872587c1be6d4909.gif](https://qiita-image-store.s3.amazonaws.com/0/33823/69f8ab1a-4b73-f711-9245-bbd833bec4ae.gif "a71f4dc9e019b67d872587c1be6d4909.gif")
