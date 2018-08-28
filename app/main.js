import React from 'react'
import ReactDOM from 'react-dom'
import Aragon, { providers } from '@aragon/client'
import { Provider } from 'mobx-react'
import { App } from '@espresso-org/drive-components'

import { mainStore } from './stores/main-store'
import { configStore } from './stores/config-store'

class ConnectedApp extends React.Component {
  state = {
    app: new Aragon(new providers.WindowMessage(window.parent)),
    observable: null,
    userAccount: '',
  }
  componentDidMount() {
    window.addEventListener('message', this.handleWrapperMessage)
    window.app1 = this.state.app

  }
  componentWillUnmount() {
    window.removeEventListener('message', this.handleWrapperMessage)
  }
  // handshake between Aragon Core and the iframe,
  // since iframes can lose messages that were sent before they were ready
  handleWrapperMessage = ({ data }) => {
    if (data.from !== 'wrapper') {
      return
    }
    if (data.name === 'ready') {
      const { app } = this.state
      this.sendMessageToWrapper('ready', true)
      this.setState({
        observable: app.state(),
      })
      app.accounts().subscribe(accounts => {
        this.setState({
          userAccount: accounts[0],
        })
      })
    }
  }
  sendMessageToWrapper = (name, value) => {
    window.parent.postMessage({ from: 'app', name, value }, '*')
  }
  render() {
    return <App {...this.state} />
  }
}
ReactDOM.render(
  <Provider mainStore={mainStore} configStore={configStore}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
)
