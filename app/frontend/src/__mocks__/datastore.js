import { Subject } from 'rxjs'
import { BigNumber } from 'bignumber.js'
import Color from 'color'
import { FileCache } from '../utils/file-cache'

class EventEmitter {
  events

  constructor() {
    this.events = new Subject()
  }

  emit(event) {
    this.events.next({
      event
    })
  }
}

export class Datastore {
    _settings = {
      storageProvider: 0,
      encryptionType: 0,

      ipfs: undefined,
      aes: undefined
    }

    _fileInfo = []

    _fileContent = []

    _availableLabels = []

    _groups = []

    _events

    _fileCache

    constructor() {
      this._events = new EventEmitter()
      this._fileCache = new FileCache([{
        id: 0,
        name: '/',
        isFolder: true,
        isPublic: true,
        isDeleted: false,
        parentFolder: 0
      }])
    }

    async addFolder(name, parentFolderId = 0) {
      const newFile = {
        id: this._fileInfo.length + 1,
        name,
        isFolder: true,
        storageRef: '',
        fileSize: new BigNumber(0),
        parentFolder: parentFolderId || 0,
        isPublic: true,
        isDeleted: false,
        owner: '0x2284dd7330abade7fa8951414fcf7d17be35f69b',
        isOwner: true,
        lastModification: new BigNumber(Math.round((new Date()).getTime() / 1000)),
        permissionAddresses: [],
        permissionGroups: [],
        permissions: {
          write: true,
          read: true // TODO
        },
        _groupPermissionList: [],
        _permissionList: [],
        _labels: [],
        labels: []

      }

      this._fileInfo.push(newFile)
      this._fileCache.addFile(newFile)

      this._fileContent.push(0)
      this._events.emit('FileChange')
    }

    async addFile(name, publicStatus, file, folderId) {
      const newFile = {
        id: this._fileInfo.length + 1,
        name,
        storageRef: '',
        fileSize: file.byteLength,
        parentFolder: folderId || 0,
        isPublic: publicStatus,
        isDeleted: false,
        owner: '0x2284dd7330abade7fa8951414fcf7d17be35f69b',
        isOwner: true,
        lastModification: new Date(),
        permissionAddresses: [],
        permissionGroups: [],
        permissions: {
          write: true,
          read: true // TODO
        },
        _groupPermissionList: [],
        _permissionList: [],
        _labels: [],
        labels: []

      }

      this._fileInfo.push(newFile)
      this._fileCache.addFile(newFile)

      this._fileContent.push(file)
      this._events.emit('FileChange')

      return this._fileInfo.length
    }

    async addMockFile(fileInfo, fileContent) {
      this._fileInfo.push({
        id: this._fileInfo.length + 1,
        _groupPermissionList: [],
        _permissionList: [],
        _labels: [],
        ...fileInfo
      })
      this._fileContent.push(fileContent)
      this._events.emit('FileChange')
      return this._fileInfo.length
    }

    async getFile(fileId) {
      const fileInfo = this.getFileInfo(fileId)
      const fileContent = this._fileContent[fileId - 1]
      return { ...fileInfo, content: fileContent }
    }

    async getFileInfo(fileId) {
      return this._fileCache.getFile(fileId)
    }

    async getFolder(folderId) {
      return this._fileCache.getFolder(folderId)
    }

    async deleteFile(fileId) {
      const fileInfo = this._fileInfo[fileId - 1]
      fileInfo.isDeleted = true
      this._events.emit('FileChange')
    }

    async deleteFilePermanently(fileId) {
      this._fileInfo[fileId - 1] = null
      this._events.emit('FileChange')
    }

    async deleteFilesPermanently(fileIds) {
      for (const fileId of fileIds)
        delete this._fileInfo[fileId - 1]

      this._events.emit('FileChange')
    }

    async restoreFile(fileId) {
      const fileInfo = this._fileInfo[fileId - 1]
      fileInfo.isDeleted = false
      this._events.emit('FileChange')
    }

    async getFilePermissions(fileId) {
      return (await this.getFileInfo(fileId))._permissionList
    }

    async getFilePath(fileId) {
      return Promise.all(
        (await this._fileCache.getFilePath(fileId))
          .map(id => this._fileCache.getFile(id))
      )
    }


    async createLabel(name, color) {
      if (name.length > 28)
        throw 'Label name must not exceed 28 characters.'

      const hexColor = Color(color).hex()

      this._availableLabels.push({
        id: this._availableLabels.length + 1,
        name,
        color: hexColor.replace('0x', '').replace('#', '')
      })
      this._events.emit('LabelChange')
    }

    async deleteLabel(labelId) {
      const index = this._availableLabels.findIndex(label => label.id === labelId)
      this._availableLabels.splice(index, 1)
      this._events.emit('LabelChange')
    }

    async getLabel(labelId) {
      return this._availableLabels.find(label => label.id === labelId)
    }

    async getLabels() {
      return this._availableLabels
    }

    async assignLabel(fileId, labelId) {
      const file = this._fileInfo[fileId - 1]
      file._labels.push(labelId)
      this._events.emit('FileChange')
    }

    async unassignLabel(fileId, labelId) {
      const file = this._fileInfo[fileId - 1]
      const index = file._labels.indexOf(labelId)
      file._labels.splice(index, 1)
      this._events.emit('FileChange')
    }


    async getFileLabelList(fileId) {
      const file = this._fileInfo[fileId - 1]

      return file._labels
    }

    async getSettings() {
      return this._settings
    }

    async setSettings(host, port, protocol, name, length) {
      this._settings.storageProvider = 1
      this._settings.ipfs = {
        host,
        port,
        protocol
      }
      this._settings.encryptionProvider = 1
      this._settings.aes = {
        name,
        length
      }
      this._events.emit('SettingsChange')
    }

    async _listFiles() {
      return Promise.all(
        this._fileInfo
          .filter(file => file)
          .map((file, i) => this.getFileInfo(i + 1))
      )
    }

    async listFiles(folderId = 0) {
      return (await this._fileCache.getFolder(folderId)).files
    }

    async setFileContent(fileId, file) {
      this.fileContent[fileId - 1] = file
      this._events.emit('FileChange')
    }

    async setEntityPermissions(fileId, entity, read, write) {
      const fileInfo = this._fileInfo[fileId - 1]
      const filePermissions = fileInfo._permissionList
      const entityPermissions = filePermissions.find(permission => permission.entity === entity)

      if (entityPermissions) {
        entityPermissions.read = read
        entityPermissions.write = write
      } else {
        filePermissions.push({
          entity,
          read,
          write
        })
        fileInfo.permissionAddresses.push(entity)
      }
      this._events.emit('PermissionChange')
    }

    async setPermissions(fileId, entityPermissions, groupPermissions, isPublic) {
      for (const permission of entityPermissions) {
        await this.setEntityPermissions(
          fileId,
          permission.entity,
          permission.read,
          permission.write
        )
      }

      for (const permission of groupPermissions) {
        await this.setGroupPermissions(
          fileId,
          permission.groupId,
          permission.read,
          permission.write
        )
      }

      this.fileContent[fileId - 1].isPublic = isPublic
      this._events.emit('PermissionChange')
    }


    async removeEntityFromFile(fileId, entity) {
      const fileInfo = this._fileInfo[fileId - 1]
      fileInfo._permissionList = fileInfo._permissionList.filter(permission => permission.entity !== entity)
      this._events.emit('PermissionChange')
    }

    async setReadPermission(fileId, entity, hasPermission) {
      const fileInfo = this._fileInfo[fileId - 1]
      const filePermissions = fileInfo._permissionList
      const entityPermissions = filePermissions.find(permission => permission.entity === entity)

      if (entityPermissions)
        entityPermissions.read = hasPermission
      else {
        filePermissions.push({
          entity,
          read: hasPermission,
          write: false
        })
        fileInfo.permissionAddresses.push(entity)
      }
      this._events.emit('PermissionChange')
    }

    async setWritePermission(fileId, entity, hasPermission) {
      const fileInfo = this._fileInfo[fileId - 1]
      const entityPermissions = fileInfo._permissionList.find(permission => permission.entity === entity)

      if (entityPermissions)
        entityPermissions.write = hasPermission
      else {
        fileInfo._permissionList.push({
          entity,
          write: hasPermission,
          read: false
        })
        fileInfo.permissionAddresses.push(entity)
      }
      this._events.emit('PermissionChange')
    }

    async setFileName(fileId, newName) {
      const fileInfo = this._fileInfo[fileId - 1]
      fileInfo.name = newName
      this._events.emit('FileChange')
    }

    async createGroup(groupName) {
      this._groups.push({
        id: this._groups.length + 1,
        name: groupName,
        entities: []
      })
      this._events.emit('GroupChange')
    }

    async getGroup(groupId) {
      return this._groups[groupId - 1]
    }

    async getGroups() {
      return this._groups
    }

    async getFileGroupPermissions(fileId) {
      return Promise.all(this._fileInfo[fileId - 1]._groupPermissionList
        .map(async permission => ({
          ...permission,
          groupName: (await this.getGroup(permission.groupId)).name
        }))
      )
    }

    async deleteGroup(groupId) {
      delete this._groups[groupId - 1]
      this._events.emit('GroupChange')
    }

    async renameGroup(groupId, newGroupName) {
      this._groups[groupId - 1].name = newGroupName
      this._events.emit('GroupChange')
    }

    async addEntityToGroup(groupId, entity) {
      this._groups[groupId - 1].entities.push(entity)
      this._events.emit('GroupChange')
    }

    async removeEntityFromGroup(groupId, entity) {
      this._groups[groupId - 1].entities = this._groups[groupId - 1].entities.filter(ent => ent !== entity)
      this._events.emit('GroupChange')
    }

    async setGroupPermissions(fileId, groupId, read, write) {
      const fileInfo = this._fileInfo[fileId - 1]
      const groupPermissions = fileInfo._groupPermissionList.find(permission => permission.groupId === groupId)

      if (groupPermissions) {
        groupPermissions.read = read
        groupPermissions.write = write
      } else {
        fileInfo._groupPermissionList.push({
          groupId,
          read,
          write
        })
        fileInfo.permissionGroups.push(groupId)
      }
      this._events.emit('PermissionChange')
    }

    async removeGroupFromFile(fileId, groupId) {
      const fileInfo = this._fileInfo[fileId - 1]

      fileInfo._groupPermissionList = fileInfo._groupPermissionList.filter(permission => permission.groupId !== groupId)
      fileInfo.permissionGroups = fileInfo.permissionGroups.filter(group => group !== groupId)
      this._events.emit('PermissionChange')
    }

    /**
     * Datastore events
     */
    async events() {
      return this._events.events
    }
}