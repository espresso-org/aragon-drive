import { observable, action, configure, computed } from 'mobx'
import { asyncComputed } from 'computed-async-mobx'

import { validateEthAddress } from '../utils'
import { downloadFile, convertFileToArrayBuffer, getExtensionForFilename } from '../utils/files'
import { EditMode } from './edit-mode'


configure({ isolateGlobalState: true })

export class MainStore {
  @observable selectedFolderId = 0

  @observable selectedFolder

  @observable selectedFolderPath = []

  @observable files = []

  @observable allFiles = []

  @observable selectedFile

  @observable editMode = EditMode.None

  @observable isAddPermissionPanelOpen = false

  @observable isAddLabelPanelOpen = false

  @observable selectedTab = 0

  @observable host

  @observable port

  @observable protocol

  @observable isLabelScreenOpen = false

  @observable isDeletedFilesScreenOpen = false

  @observable isGroupsSectionOpen = false

  @observable fileUploadIsOpen = false

  @observable fileContentIsOpen = false

  @observable uploadedFile

  @observable groups = []

  @observable selectedGroup

  @observable selectedGroupEntity

  @observable searchQuery = ''

  @observable displaySearchBar = false

  @observable filesLoading = true

  @observable groupsLoading = false

  @computed get filteredFiles() {
    const searchQuery = this.searchQuery.toLocaleLowerCase()

    if (searchQuery) {
      const files = this.allFiles

      if (searchQuery.length > 6 && searchQuery.substring(0, 6) === 'label:') {
        const labelQuery = searchQuery.substring(6)
        return files.filter(file => file && !file.isDeleted && file.labels.some(label => label.name.toLocaleLowerCase() === labelQuery))
      } else {
        return files.filter(file => file && !file.isDeleted && file.name.toLocaleLowerCase().includes(this.searchQuery))
      }
    } else
      return this.files.toJS().filter(file => file && !file.isDeleted)
  }

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

  @action setSelectedFolder(folderId) {
    this.selectedFolderId = folderId
    this._refreshFiles()
  }

  @action async setFileName(fileId, newName) {
    if (newName) {
      await this._datastore.setFileName(fileId, newName)
      this.setEditMode(EditMode.None)
    }
  }

  @action async filterFilesWithLabel(label) {
    this.searchQuery = `label:${label.name}`
  }

  @action async deleteFile() {
    if (this.selectedFile != null)
      await this._datastore.deleteFile(this.selectedFile.id)
  }

  openFileUploadPanel(e) {
    this.uploadedFile = e.target.files[0]
    this.setEditMode(EditMode.FileUpload);
    this.fileUploadIsOpen = true;
    e.target.value = ''
  }

  openNewFolderPanel() {
    this.setEditMode(EditMode.NewFolder);
    this.fileUploadIsOpen = true;
  }

  async openChangeFileContentPanel(e) {
    this.uploadedFile = e.target.files[0]
    if (getExtensionForFilename(this.uploadedFile.name) !== getExtensionForFilename(this.selectedFile.name)) {
      this.setEditMode(EditMode.Content);
      this.fileContentIsOpen = true;
    } else {
      const newFileContent = await convertFileToArrayBuffer(this.uploadedFile)
      this.setFileContent(this.selectedFile.id, newFileContent)
    }
    e.target.value = ''
  }

  async setNewFileContentNewExtension(fileId, newFileName, newFileContent) {
    await this._datastore.setFileNameAndContent(fileId, newFileName, newFileContent)
    this.setEditMode(EditMode.None)
  }

  async uploadFile(filename) {
    if (filename) {
      const result = await convertFileToArrayBuffer(this.uploadedFile)
      await this._datastore.addFile(filename, result, this.selectedFolder.id)
      this.setEditMode(EditMode.None)
    }
  }

  async createFolder(name) {
    this._datastore.addFolder(name, this.selectedFolder.id)
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
    this.selectedTab = 0
    if (this.selectedFile && this.selectedFile.id === fileId) {
      this.selectedFile = null
      return this.selectedFile
    }

    const selectedFile = this.files.find(file => file && file.id === fileId)
    if (selectedFile) {
      this.selectedFile = {
        ...selectedFile,
        parentFolderInfo: this.selectedFolderPath[this.selectedFolderPath.length - 1]
      }
    }
    return null
  }

  @action async createGroup(name) {
    if (name) {
      await this._datastore.createGroup(name)
      this.setEditMode(EditMode.None)
    }
  }

  @action async deleteGroup(groupId) {
    if (this.selectedGroup != null) {
      await this._datastore.deleteGroup(groupId)
      this.setEditMode(EditMode.None)
      this.selectedGroup = null
    }
  }

  @action async renameGroup(groupId, newGroupName) {
    if (newGroupName) {
      await this._datastore.renameGroup(groupId, newGroupName)
      this.setEditMode(EditMode.None)
    }
  }

  @action async addEntityToGroup(groupId, entity) {
    if (validateEthAddress(entity)) {
      await this._datastore.addEntityToGroup(groupId, entity)
      this.setEditMode(EditMode.None)
    }
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
      // TODO: Add a throttle to prevent excessive refreshes
      (await this._datastore.events()).subscribe((event) => {
        switch (event.event) {
          case 'FileChange':
            this.setEditMode(EditMode.None)
            this._refreshFiles()
            break
          case 'PermissionChange':
          case 'SettingsChange':
            this._refreshFiles()
            break

          case 'GroupChange':
            this._refreshAvailableGroups()
            break

          case 'LabelChange':
            this.isAddLabelPanelOpen = false
            break
        }
      });

      this._refreshFiles()
      this._refreshAvailableGroups()
      res()
    })
  }

  async getFileLabelList(file) {
    const availableLabels = await this._datastore.getLabels()
    return file.labels
      .map(id => availableLabels.find(label => label.id === id))
      .filter(label => label)
  }

  async _refreshFiles() {
    this.filesLoading = true

    this.selectedFolder = await this._datastore.getFolder(this.selectedFolderId)
    this.files = await Promise.all(
      this.selectedFolder.files
        .sort(folderFirst)
        .map(async file => ({
          ...file,
          labels: await this.getFileLabelList(file)
        }))
    )
    this.selectedFolderPath = await this._datastore.getFilePath(this.selectedFolderId)

    // Update selected file
    if (this.selectedFile) {
      this.selectedFile = this.filteredFiles.find(file => file && file.id === this.selectedFile.id)
      if (this.selectedFile)
        this.selectedFile.parentFolderInfo = this.selectedFolderPath[this.selectedFolderPath.length - 1]
    }

    this.allFiles = (await Promise.all(
      (await this._datastore.getAllFiles())
        .map(async file => ({
          ...file,
          labels: await this.getFileLabelList(file)
        }))
    )).sort(folderFirst)
    this.filesLoading = false
  }

  async _refreshAvailableGroups() {
    this.groupsLoading = true
    this.groups = await this._datastore.getGroups()

    // Update selected file
    if (this.selectedGroup)
      this.selectedGroup = this.groups.find(group => group && group.id === this.selectedGroup.id)
    this.groupsLoading = false
  }
}

/**
 * File/Folder sort function
 * @param {*} file1
 * @param {*} file2
 */
function folderFirst(file1, file2) {
  if (file1.isFolder && !file2.isFolder)
    return -1;
  else if (!file1.isFolder && file2.isFolder)
    return 1;
  else {
    const file1Name = new String(file1.name)
    return file1Name.localeCompare(file2.name)
  }
}
