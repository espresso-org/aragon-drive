import React from "react"
import { BigNumber } from 'bignumber.js'
import { Provider } from 'mobx-react'
import { aragonStoriesOf } from '../src/utils/aragon-stories-of'
import { DeletedFilesScreen } from '../src/components/deleted-files-screen/deleted-files-screen'
import { Datastore as MockedDatastore } from '../src/__mocks__/datastore'
import { MainStore } from '../src/stores/main-store'


const file = {
  name: 'file-name.jpg',
  owner: '0x2284dd7330abade7fa8951414fcf7d17be35f69b',
  lastModification: new BigNumber(1534519442),
  isDeleted: true,
  fileSize: new BigNumber(122),
  permissions: {
    read: true,
    write: true
  }
}

const file2 = {
  name: 'file-name.jpg',
  owner: '0x2284dd7330abade7fa8951414fcf7d17be35f691',
  lastModification: new BigNumber(1534519442),
  fileSize: new BigNumber(122),
  permissions: {
    read: true,
    write: true
  }
}

setTimeout(async () => {
  await mainStore._datastore.addMockFile(file, new ArrayBuffer(60))
  await mainStore._datastore.addMockFile(file2, new ArrayBuffer(60))
  await mainStore._refreshFiles()
}, 500)


aragonStoriesOf("DeletedFileScreen", module).add("Basic", () => {
  const datastore = new MockedDatastore({})
  const mainStore = new MainStore(datastore)

  return (
    <Provider datastore={datastore} mainStore={mainStore}>
      <DeletedFilesScreen isVisible mainStore={mainStore} />
    </Provider>
  )
})
