import React from 'react'
import { render } from 'react-dom'

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
