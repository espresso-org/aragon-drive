import { observable, computed, action, decorate } from 'mobx'
import Aragon, { providers as aragonProviders } from '@aragon/client'

import { downloadFile, convertFileToArrayBuffer } from '../utils/files'
import { Datastore, providers } from 'aragon-datastore'

export const EditMode = {
  None: "None",
  Name: "Name",
  Content: "Content",
  Permissions: "Permissions"
}

class MainStore {

  @observable files = []
  @observable selectedFile
  @observable editMode = EditMode.None

  isFileSelected(file) {
    return this.selectedFile && this.selectedFile.id === file.id
  }

  setEditMode(mode) {
    this.editMode = mode
  }

  async setFilename(fileId, newName) {
    await this._datastore.setFilename(fileId, newName)
    this.setEditMode(EditMode.None)
  }

  async uploadFiles(files) {
    // TODO: Add warning when there are multiple files

    for (let file of files) {
      const result = await convertFileToArrayBuffer(file)
      await this._datastore.addFile(file.name, result)
    }

  }

  async addWritePermission(fileId, address) {
    await this._datastore.setWritePermission(fileId, address, true)
  }

  async setFileContent(fileId, fileContent) {
    await this._datastore.setFileContent(fileId, fileContent) 
    this.setEditMode(EditMode.None)
  }

  downloadFile = async fileId => {
    const file = await this._datastore.getFile(fileId)
    downloadFile(file.content, file.name)
  }

  selectFile = async fileId => {
    if (this.selectedFile && this.selectedFile.id === fileId) 
      return this.selectedFile = null    

    const selectedFile = this.files.find(file => file && file.id === fileId)
    
    if (selectedFile)
      this.selectedFile = selectedFile
  }


  _datastore

  constructor() {
    
    setTimeout(() => this.initialize(), 1)
    window.mainStore = this
  }

  async initialize() {    

    this._araApp = new Aragon(new aragonProviders.WindowMessage(window.parent))

    this._datastore = new Datastore({
      storageProvider: new providers.storage.Ipfs(),
      encryptionProvider: new providers.encryption.Aes(),
      rpcProvider: new providers.rpc.Aragon(this._araApp)
    });

    (await this._datastore.events()).subscribe(event => {  
      switch (event.event) {
        case 'FileRename':
        case 'FileContentUpdate':
        case 'NewFile':
        case 'NewWritePermission':
        case 'NewReadPermission':
        this._refreshFiles()
        break
      }
    })
    
    this._refreshFiles()
  }

  async _refreshFiles() {
    console.log('Refresh files')
    this.files = await this._datastore.listFiles() 
    
    // Update selected file
    if (this.selectedFile) 
      this.selectedFile = this.files.find(file => file && file.id === this.selectedFile.id)
    
  }

}

export const mainStore = new MainStore()