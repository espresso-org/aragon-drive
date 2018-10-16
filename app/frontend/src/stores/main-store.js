import { observable, action, configure } from 'mobx'
// import Aragon, { providers as aragonProviders } from '@aragon/client'
import { asyncComputed } from 'computed-async-mobx'

import { downloadFile, convertFileToArrayBuffer } from '../utils/files'
// import { Datastore, providers } from 'aragon-datastore'
// import { configStore } from './config-store'
import { EditMode } from './edit-mode'

configure({ isolateGlobalState: true })

export class MainStore {
  @observable files = []

  @observable selectedFile

  @observable editMode = EditMode.None

  @observable isAddPermissionPanelOpen = false

  @observable newPublicStatus

  @observable host

  @observable port

  @observable protocol

  @observable isGroupsSectionOpen = false

  @observable groups = []

  @observable selectedGroup

  @observable selectedGroupEntity

  selectedFilePermissions = asyncComputed([], 100, async () =>
    this.selectedFile ?
      this._datastore.getFilePermissions(this.selectedFile.id)
      :
      []
  )

  selectedFileGroupPermissions = asyncComputed([], 100, async () =>
    this.selectedFile ?
      this._datastore.getFileGroupPermissions(this.selectedFile.id)
      :
      []
  )

  isFileSelected(file) {
    return this.selectedFile && this.selectedFile.id === file.id
  }

  @action setEditMode(mode) {
    this.editMode = mode
  }

  @action async setFileName(fileId, newName) {
    await this._datastore.setFileName(fileId, newName)
    this.setEditMode(EditMode.None)
  }

  @action async deleteFile() {
    if (this.selectedFile != null) {
      await this._datastore.deleteFile(this.selectedFile.id)
      this.selectedFile = null
    }
  }

  async uploadFiles(files) {
    // TODO: Add warning when there are multiple files

    for (const file of files) {
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

  downloadFile = async (fileId) => {
    const file = await this._datastore.getFile(fileId)
    downloadFile(file.content, file.name)
  }

  selectFile = async (fileId) => {
    if (this.selectedFile && this.selectedFile.id === fileId) {
      this.selectedFile = null
      return this.selectedFile
    }

    const selectedFile = this.files.find(file => file && file.id === fileId)

    if (selectedFile) {
      this.selectedFile = selectedFile
      this.newPublicStatus = selectedFile.isPublic
    }
    return null
  }

  @action async createGroup(name) {
    await this._datastore.createGroup(name)
    this.setEditMode(EditMode.None)
  }

  @action async deleteGroup(groupId) {
    if (this.selectedGroup != null) {
      await this._datastore.deleteGroup(groupId)
      this.setEditMode(EditMode.None)
      this.selectedGroup = null
    }
  }

  @action async renameGroup(groupId, newGroupName) {
    await this._datastore.renameGroup(groupId, newGroupName)
    this.setEditMode(EditMode.None)
  }

  @action async addEntityToGroup(groupId, entity) {
    await this._datastore.addEntityToGroup(groupId, entity)
    this.setEditMode(EditMode.None)
  }

  @action async removeEntityFromGroup(groupId, entity) {
    await this._datastore.removeEntityFromGroup(groupId, entity)
    this.selectedGroupEntity = null
  }

  isGroupSelected(group) {
    return this.selectedGroup && this.selectedGroup.id === group.id
  }

  selectGroup = async (groupId) => {
    if (this.selectedGroup && this.selectedGroup.id === groupId) {
      this.selectedGroupEntity = null
      this.selectedGroup = null
      return this.selectedGroup
    }

    const selectedGroup = this.groups.find(group => group && group.id === groupId)

    if (selectedGroup) {
      this.selectedGroupEntity = null
      this.selectedGroup = selectedGroup
    }
    return null
  }

  isGroupEntitySelected(entity) {
    return this.selectedGroupEntity && this.selectedGroupEntity === entity
  }

  selectGroupEntity = async (entity) => {
    if (entity !== this.selectedGroupEntity)
      this.selectedGroupEntity = entity
    else
      this.selectedGroupEntity = null;
  }

  _datastore

  constructor(datastore) {
    this._datastore = datastore
    setTimeout(() => this.initialize(), 1)
    window.mainStore = this
  }

  async initialize() {
    return new Promise(async (res) => {
      (await this._datastore.events()).subscribe((event) => {
        switch (event.event) {
          case 'FileRename':
          case 'FileContentUpdate':
          case 'NewFile':
          case 'NewWritePermission':
          case 'NewReadPermission':
          case 'DeleteFile':
          case 'NewEntityPermissions':
          case 'NewGroupPermissions':
          case 'NewPermissions':
          case 'GroupPermissionsRemoved':
          case 'EntityPermissionsRemoved':
            this._refreshFiles()
            break

          case 'GroupChange':
            this._refreshAvailableGroups()
        }
      });

      this._refreshFiles()
      this._refreshAvailableGroups()
      res()
    })
  }

  async _refreshFiles() {
    this.files = await this._datastore.listFiles()

    // Update selected file
    if (this.selectedFile)
      this.selectedFile = this.files.find(file => file && file.id === this.selectedFile.id)
  }

  async _refreshAvailableGroups() {
    this.groups = await this._datastore.getGroups()

    // Update selected file
    if (this.selectedGroup)
      this.selectedGroup = this.groups.find(group => group && group.id === this.selectedGroup.id)
  }
}
