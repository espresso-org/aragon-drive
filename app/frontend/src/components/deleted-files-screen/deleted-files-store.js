import { observable, computed, action, observe } from 'mobx'


export class DeletedFilesStore {
  @computed get files() { return this._mainStore.files.toJS().filter(file => file.isDeleted) }

  @observable selectedFile = null

  @observable deletedFilesLoading = false

  @action async deleteFilesPermanently() {
    await this._datastore.deleteFilesPermanently(this.files.map(file => file.id))
  }

  @action async deletePermanently(file) {
    this._datastore.deleteFilePermanently(file.id)
  }

  @action async restoreFile(file) {
    this._datastore.restoreFile(file.id)
  }

  @action selectFile(file) {
    if (this.selectedFile && this.selectedFile.id === file.id)
      this.selectedFile = null
    else
      this.selectedFile = file
  }

  _mainStore

  constructor(mainStore) {
    this._mainStore = mainStore
    this._datastore = mainStore._datastore
    window.deletedFilesStore = this
    setTimeout(() => this.initialize(), 1)
  }

  async initialize() {
    observe(mainStore, 'files', () => this._refreshFiles())

    return new Promise(async (res) => {
      // TODO: Add a throttle to prevent excessive refreshes
      (await this._datastore.events()).subscribe((event) => {
        switch (event.event) {
          case 'FileChange':
            this._refreshFiles()
            break
        }
      });

      this._refreshFiles()
      res()
    })
  }

  async _refreshFiles() {
    this.deletedFilesLoading = true
    if (this.selectedFile)
      this.selectedFile = this.files.find(file => file && file.id === this.selectedFile.id && file.isDeleted)
    this.deletedFilesLoading = false
  }
}