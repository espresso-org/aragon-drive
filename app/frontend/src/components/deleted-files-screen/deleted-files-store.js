import { observable, computed, action, configure } from 'mobx'



export class DeletedFilesStore {

  @computed get files() { return this._mainStore.files.toJS().filter(file => file.isDeleted) }
  @observable selectedFile = {}

  @action selectFile(file) {
    if (this.selectedFile && this.selectedFile.id === file.id) 
      this.selectedFile = null    
    else
      this.selectedFile = file
  }

  _mainStore

  constructor(mainStore) {
    this._mainStore = mainStore
  }
}