import React from "react"
import { Provider } from 'mobx-react'
import { BigNumber } from 'bignumber.js'
import { aragonStoriesOf } from '../src/utils/aragon-stories-of'
import { EditFilePermissions } from '../src/components/edit-file-permissions/edit-file-permissions'
import { Datastore as MockedDatastore } from '../src/__mocks__/datastore'
import { MainStore } from '../src/stores/main-store'
import { ConfigStore } from '../src/stores/config-store'
import { PermissionsStore } from '../src/stores/permissions-store'

const file = {
  name: 'file-name.jpg',
  owner: '0x2284dd7330abade7fa8951414fcf7d17be35f69b',
  lastModification: new BigNumber(1534519442),
  permissions: {
    read: true,
    write: true
  }
}

const datastore = new MockedDatastore({})
const configStore = new ConfigStore(datastore)
const mainStore = new MainStore(datastore)
const permissionsStore = new PermissionsStore(datastore, mainStore)

setTimeout(async () => {
  datastore.createGroup("Group #1")
  datastore.createGroup("Lggkiwfj aef")
  datastore.createGroup("Group #32")
  await datastore.addFile('test.jpeg', new ArrayBuffer(60))
  await datastore.setEntityPermissions(
    1,
    '0x8401eb5ff34cc943f096a32ef3d5113febe8d4fb',
    true,
    false
  )

  await datastore.setGroupPermissions(
    1,
    1,
    true,
    true
  )
  await mainStore._refreshFiles()
  await mainStore.selectFile(1)
}, 0)


aragonStoriesOf("EditPermissions", module).add("Basic", () => (
  <Provider permissionsStore={permissionsStore} datastore={datastore} mainStore={mainStore} configStore={configStore}>
    <EditFilePermissions file={file} />
  </Provider>
))
