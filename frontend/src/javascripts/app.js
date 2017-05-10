import template from './template/app.jsx'
import React from 'react'
import { render } from 'react-dom'

class SampleApp extends React.Component {
  constructor() {
		super()
		this.state = {
		  //古家,ひろみつさん,野上さん,甲斐さん,今さんのプロフィール画像
		  //今回はDB連携しないので画像URLべた書き
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
  render() {
    const listItems = this.state.lunchPair.map((imgUrl) =>
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
}

const elem = React.createElement(SampleApp)
render(elem, document.getElementById('sample'))
