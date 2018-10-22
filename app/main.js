import React from 'react'
import ReactDOM from 'react-dom'
import Aragon, { providers as aragonProviders } from '@aragon/client'
import { Datastore, providers } from '@espresso-org/aragon-datastore'
import { Provider } from 'mobx-react'
import { App, ConfigStore, MainStore, PermissionsStore } from './frontend'

import './css/styles.css'

/**
 * Injected stores and objects in the App
 */
function initProvidedObjects() {
  const aragonApp = new Aragon(new aragonProviders.WindowMessage(window.parent))

  const datastore = new Datastore({
    rpcProvider: new providers.rpc.Aragon(aragonApp)
  })

  const configStore = new ConfigStore(datastore)
  const mainStore = new MainStore(datastore)
  const permissionsStore = new PermissionsStore(datastore, mainStore)

  return { aragonApp, datastore, configStore, mainStore, permissionsStore }
}

class ConnectedApp extends React.Component {
  state = {
    app: null,
    observable: null,
    userAccount: '',
  }

  constructor(props) {
    super(props)

    this.stores = initProvidedObjects()
    this.state.app = this.stores.aragonApp
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
      app.accounts().subscribe((accounts) => {
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
    return (
      <Provider {...this.stores}>
        <App {...this.state} />
      </Provider>
    )
  }
}

ReactDOM.render(
  <ConnectedApp />,
  document.getElementById('root')
)
