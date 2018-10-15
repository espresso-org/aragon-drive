import { Subject } from 'rxjs'
import { BigNumber } from 'bignumber.js'

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

      ipfs: undefined
    }

    _fileInfo = []

    _fileContent = []

    _groups = []

    _events

    constructor() {
      this._events = new EventEmitter()
    }

    async addFile(name, file) {
      this._fileInfo.push({
        id: this._fileInfo.length + 1,
        name,
        storageRef: '',
        fileSize: new BigNumber(file.byteLength),
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

      })

      this._fileContent.push(file)
      this._events.emit('NewFile')

      return this._fileInfo.length
    }

    async addMockFile(fileInfo, fileContent) {
      this._fileInfo.push({
        id: this._fileInfo.length + 1,
        ...fileInfo
      })
      this._fileContent.push(fileContent)
      this._events.emit('NewFile')
      return this._fileInfo.length
    }

    async getFile(fileId) {
      const fileInfo = this.getFileInfo(fileId)
      const fileContent = this._fileContent[fileId - 1]
      return { ...fileInfo, content: fileContent }
    }

    async getFileInfo(fileId) {
      const fileInfo = this._fileInfo[fileId - 1]
      return { id: fileId, ...fileInfo }
    }

    async deleteFile(fileId) {
      const fileInfo = this.getFileInfo(fileId)
      fileInfo.isDeleted = true
      this._events.emit('DeleteFile')
    }

    async getFilePermissions(fileId) {
      return (await this.getFileInfo(fileId))._permissionList
    }

    async getSettings() {
      return this._settings
    }

    async setIpfsStorageSettings(host, port, protocol) {
      this._settings.storageProvider = 1
      this._settings.ipfs = {
        host,
        port,
        protocol
      }
      this._events.emit('SettingsChanged')
    }

    async listFiles() {
      return Promise.all(
        this._fileInfo
          .map((file, i) => this.getFileInfo(i + 1))
      )
    }

    async setFileContent(fileId, file) {
      this.fileContent[fileId - 1] = file
      this._events.emit('FileContentUpdate')
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
      this._events.emit('NewEntityPermissions')
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
      this._events.emit('NewPermissions')
    }

    async removeEntityFromFile(fileId, entity) {
      const fileInfo = this._fileInfo[fileId - 1]
      fileInfo._permissionList = fileInfo._permissionList.filter(permission => permission.entity !== entity)
      this._events.emit('EntityPermissionsRemoved')
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
      this._events.emit('NewReadPermission')
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
      this._events.emit('NewWritePermission')
    }

    async setFileName(fileId, newName) {
      const fileInfo = this._fileInfo[fileId - 1]
      fileInfo.name = newName
      this._events.emit('FileRename')
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
      this._events.emit('NewGroupPermissions')
    }

    async removeGroupFromFile(fileId, groupId) {
      const fileInfo = this._fileInfo[fileId - 1]

      fileInfo._groupPermissionList = fileInfo._groupPermissionList.filter(permission => permission.groupId !== groupId)
      fileInfo.permissionGroups = fileInfo.permissionGroups.filter(group => group !== groupId)
      this._events.emit('GroupPermissionsRemoved')
    }

    /**
     * Datastore events
     */
    async events() {
      return this._events.events
    }
}