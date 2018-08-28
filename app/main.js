import React from 'react'
import ReactDOM from 'react-dom'
import Aragon, { providers as aragonProviders } from '@aragon/client'
import { Datastore, providers } from 'aragon-datastore'
import { Provider } from 'mobx-react'
import { App, ConfigStore, MainStore } from '@espresso-org/drive-components'

//import { mainStore } from './stores/main-store'

import 'rodal/lib/rodal.css'
import './css/styles.css'

const araApp = new Aragon(new aragonProviders.WindowMessage(window.parent))
const datastore = new Datastore({
  rpcProvider: new providers.rpc.Aragon(araApp)
})
const configStore = new ConfigStore()
const mainStore = new MainStore(datastore, configStore)

class ConnectedApp extends React.Component {
  state = {
    app: araApp,
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
