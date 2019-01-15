import '@babel/polyfill'

import React from "react"
import { Provider } from 'mobx-react'
import { aragonStoriesOf } from '../src/utils/aragon-stories-of'
import { App } from '../src/components/app'
import { Datastore as MockedDatastore } from '../src/__mocks__/datastore'
import { MainStore } from '../src/stores/main-store'
import { ConfigStore } from '../src/stores/config-store'
import { PermissionsStore } from '../src/stores/permissions-store'
import { LabelStore } from '../src/stores/label-store'

aragonStoriesOf("Main App", module).add("Basic", () => {
  const datastore = new MockedDatastore({})
  const configStore = new ConfigStore(datastore)
  const mainStore = new MainStore(datastore)
  const permissionsStore = new PermissionsStore(datastore, mainStore)
  const labelStore = new LabelStore(datastore, mainStore)

  datastore.createGroup("Group #1")
  datastore.createGroup("Lggkiwfj aef")
  datastore.createGroup("Group #32")

  return (
    <Provider labelStore={labelStore} permissionsStore={permissionsStore} datastore={datastore} mainStore={mainStore} configStore={configStore}>
      <App />
    </Provider>
  )
})

aragonStoriesOf("Main App", module).add("Without config", () => {
  const datastore = new MockedDatastore({})
  const configStore = new ConfigStore(datastore)
  const mainStore = new MainStore(datastore)
  const permissionsStore = new PermissionsStore(datastore, mainStore)
  const labelStore = new LabelStore(datastore, mainStore)

  datastore.setSettings('127.0.0.1', 5001, 'http')

  datastore.createLabel('Label 1', '#8ed1fc')
  datastore.createLabel('Label 2', '#0034AB')
  datastore.createLabel('Label 3', '#ED34AB')


  datastore.addFile('test.jpeg', true, new ArrayBuffer(60))
  datastore.addFolder('test folder', 0)
  datastore.addFile('aefw.pdf', true, new ArrayBuffer(60), 2)

  datastore.assignLabel(1, 1)
  // datastore.assignLabel(1, 2)

  datastore.createGroup("Group #1")
  datastore.createGroup("Lggkiwfj aef")
  datastore.createGroup("Group #32")

  return (
    <Provider labelStore={labelStore} permissionsStore={permissionsStore} datastore={datastore} mainStore={mainStore} configStore={configStore}>
      <App />
    </Provider>
  )
})

aragonStoriesOf("Main App", module).add("Label Screen", () => {
  const datastore = new MockedDatastore({})
  const configStore = new ConfigStore(datastore)
  const mainStore = new MainStore(datastore)
  const permissionsStore = new PermissionsStore(datastore, mainStore)
  const labelStore = new LabelStore(datastore, mainStore)

  datastore.setSettings('127.0.0.1', 5001, 'http', 'aes-cbc', 256)

  datastore.createLabel('label 1', '#1234AB')
  datastore.createLabel('label 2', '#ED34AB')


  datastore.createGroup("Group #1")
  datastore.createGroup("Lggkiwfj aef")
  datastore.createGroup("Group #32")

  mainStore.isLabelScreenOpen = true

  return (
    <Provider labelStore={labelStore} permissionsStore={permissionsStore} datastore={datastore} mainStore={mainStore} configStore={configStore}>
      <App />
    </Provider>
  )
})
