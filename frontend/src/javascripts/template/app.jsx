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
