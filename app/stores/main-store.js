import { observable, computed, action, decorate } from 'mobx'
import Aragon, { providers as aragonProviders } from '@aragon/client'
import { asyncComputed } from 'computed-async-mobx'

import { downloadFile, convertFileToArrayBuffer } from '../utils/files'
import { Datastore, providers } from 'aragon-datastore'
import { configStore } from './config-store'

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

  @observable host
  @observable port
  @observable protocol
  
  selectedFilePermissions = asyncComputed([], 100, async () => 
    this.selectedFile ?
      this._datastore.getFilePermissions(this.selectedFile.id)
      :
      []
  )

  isFileSelected(file) {
    return this.selectedFile && this.selectedFile.id === file.id
  }

  @action setEditMode(mode) {
    this.editMode = mode
  }

  @action async setFilename(fileId, newName) {
    await this._datastore.setFilename(fileId, newName)
    this.setEditMode(EditMode.None)
  }

  @action async deleteFile() {
    if(this.selectedFile != null) {
      await this._datastore.deleteFile(this.selectedFile.id)
      this.selectedFile = null
    }
  }

  @action async setIpfsStorageSettings(host, port, protocol) {
    if(host && port && protocol)
      await this._datastore.setIpfsStorageSettings(host, port, protocol)
  }

  async uploadFiles(files) {
    // TODO: Add warning when there are multiple files

    for (let file of files) {
      const result = await convertFileToArrayBuffer(file)
      await this._datastore.addFile(file.name, result)
    }
  }

  async addReadPermission(fileId, address) {
    await this._datastore.setReadPermission(fileId, address, true)
  }

  async addWritePermission(fileId, address) {
    await this._datastore.setWritePermission(fileId, address, true)
  }

  async removeReadPermission(fileId, address) {
    await this._datastore.setReadPermission(fileId, address, false)
  }

  async removeWritePermission(filedId, address) {
    await this._datastore.setWritePermission(filedId, address, false)
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
    return new Promise(async (res, rej) => {

      this._araApp = new Aragon(new aragonProviders.WindowMessage(window.parent))

      setTimeout(async () => {        
        this._datastore = new Datastore({
          rpcProvider: new providers.rpc.Aragon(this._araApp)
        });
        
        (await this._datastore.events()).subscribe(event => {  
          switch (event.event) {
            case 'FileRename':
            case 'FileContentUpdate':
            case 'NewFile':
            case 'NewWritePermission':
            case 'NewReadPermission':
            case 'DeleteFile':
            this._refreshFiles()
            break
          }
        });

        const datastoreSettings = await this._datastore.getSettings()
        if (datastoreSettings.storageProvider === 0) 
          configStore.isConfigSectionOpen = true
        else {
          configStore.initialize()
          this.host = datastoreSettings.ipfs.host
          this.port = datastoreSettings.ipfs.port
          this.protocol = datastoreSettings.ipfs.protocol
        }
        
        this._refreshFiles()
        res()
      }, 1000)
    })
    this._refreshFiles()
  }

  async _refreshFiles() {
    this.files = await this._datastore.listFiles() 
    
    // Update selected file
    if (this.selectedFile) 
      this.selectedFile = this.files.find(file => file && file.id === this.selectedFile.id)
  }
}

export const mainStore = new MainStore()