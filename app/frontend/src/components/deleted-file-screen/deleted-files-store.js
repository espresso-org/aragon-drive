import { observable, computed, action, configure } from 'mobx'



export class DeletedFilesStore {

  @computed get files() { return this._mainStore.files.toJS().filter(file => file.isDeleted) }

  _mainStore

  constructor(mainStore) {
    this._mainStore = mainStore
  }
}