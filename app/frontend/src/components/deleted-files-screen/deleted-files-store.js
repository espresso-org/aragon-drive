import { observable, computed, action } from 'mobx'


export class DeletedFilesStore {
  @computed get files() { return this._mainStore.files.toJS().filter(file => file.isDeleted) }

  @observable selectedFile = null


  @action async deleteFilesPermanently() {
    await this._datastore.deleteFilesPermanently(this.files.map(file => file.id))
    this.selectedFile = null
  }

  @action async deletePermanently(file) {
    this._datastore.deleteFilePermanently(file.id)
    this.selectedFile = null
  }

  @action async restoreFile(file) {
    this._datastore.restoreFile(file.id)
    this.selectedFile = null
  }

  @action selectFile(file) {
    if (this.selectedFile && this.selectedFile.id === file.id)
      this.selectedFile = null
    else
      this.selectedFile = file
  }


  downloadFile(file) {
    // TODO
  }

  _mainStore

  constructor(mainStore) {
    this._mainStore = mainStore
    this._datastore = mainStore._datastore
  }
}