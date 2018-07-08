import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './style.less'
import { App } from './App';

function createContainer() {
  const root = document.createElement('div')
  document.body.appendChild(root)
  return root
}

ReactDOM.render(<App />, createContainer())
