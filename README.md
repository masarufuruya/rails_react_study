# rails_react_study
Rails+WebpackでReactを使った開発を始めるための勉強用リポジトリ

## ソースコードをクローン
```
$ git clone git@github.com:masarufuruya/rails_react_study.git
$ cd rails_react_study
```

## 作業用ブランチ作成
```
$ git checkout -b [各自の名前(例: furuya)]
```

## Nodebrewのインストール
Nodeは頻繁にアップデートされているのでNodebrewでバージョン管理するようにすると便利。

```
$ curl -L git.io/nodebrew | perl - setup
```

### パスの追加(bashの場合)
```
$ echo 'export PATH=$HOME/.nodebrew/current/bin:$PATH' >> ~/.bashrc
$ source ~/.bashrc
```

### パスの追加(zshの場合)
```
$ echo 'export PATH=$HOME/.nodebrew/current/bin:$PATH' >> ~/.zshrc
$ source ~/.zshrc
```

## Nodeのインストール

```
$ nodebrew install-binary v4.4.7
$ nodebrew use v4.4.7
$ node -v # v.4.4.7と表示されればOK
```

## 必要なモジュールをインストール
```
$ npm install
```

* npm iと省略も可能

## Webpackの設定ファイルを用意

```
cp webpack.config.sample.js webpack.config.js
```

## コンパイルを試す
```
./node_modules/.bin/webpack
```

* app/assets/javascripts/component/app.jsの中身を確認する

## .babelrcを用意する
babelは色々変換することが出来るので、何を変換するのかを指定する必要がある。
`.babelrc`という設定ファイルを作ってpresetsを指定すればいい

```
touch .babelrc
echo '{ "presets": ["react", "es2015"] }' >> .babelrc
```

## もう一度コンパイルする
```
./node_modules/.bin/webpack
```

ES2015の変換が行われるので初回は結構時間かかる

## ファイルに変更があったら自動コンパイルさせる
-w,--watchオプションを指定すると変更したファイルのみコンパイルしてくれる

```
./node_modules/.bin/webpack -w
```

## Reactコンポーネントを作る
以下のコードに書き換える

```frontend/src/javascripts/app.js
import React from 'react'


class SampleApp extends React.Component {
  render() {
    return (
      <h1>
        Hello World!
      </h1>
    )
  }
}

const elem = React.createElement(SampleApp)
render(elem, document.getElementById('sample'))
```

## 動作を確認する
```
rails s -p 3001
```

localhost:3001にアクセスしてHello World!と表示されればOK
