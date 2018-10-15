import React from "react"
import { Provider } from 'mobx-react'
import { aragonStoriesOf } from '../src/utils/aragon-stories-of'
import { App } from '../src/components/app'
import { Datastore as MockedDatastore } from '../src/__mocks__/datastore'
import { MainStore } from '../src/stores/main-store'
import { ConfigStore } from '../src/stores/config-store'
import { PermissionsStore } from '../src/stores/permissions-store'

aragonStoriesOf("Main App", module).add("Basic", () => {
  const datastore = new MockedDatastore({})
  const configStore = new ConfigStore(datastore)
  const mainStore = new MainStore(datastore)
  const permissionsStore = new PermissionsStore(datastore, mainStore)

  datastore.createGroup("Group #1")
  datastore.createGroup("Lggkiwfj aef")
  datastore.createGroup("Group #32")

  return (
    <Provider permissionsStore={permissionsStore} datastore={datastore} mainStore={mainStore} configStore={configStore}>
      <App />
    </Provider>
  )
})

aragonStoriesOf("Main App", module).add("Without config", () => {
  const datastore = new MockedDatastore({})
  const configStore = new ConfigStore(datastore)
  const mainStore = new MainStore(datastore)
  const permissionsStore = new PermissionsStore(datastore, mainStore)

  datastore.setIpfsStorageSettings('127.0.0.1', 5001, 'http')

  datastore.createGroup("Group #1")
  datastore.createGroup("Lggkiwfj aef")
  datastore.createGroup("Group #32")

  return (
    <Provider permissionsStore={permissionsStore} datastore={datastore} mainStore={mainStore} configStore={configStore}>
      <App />
    </Provider>
  )
})
