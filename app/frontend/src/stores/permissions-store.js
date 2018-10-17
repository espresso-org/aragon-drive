import { observable, configure, observe } from 'mobx'
import { EditMode } from './edit-mode'

configure({ isolateGlobalState: true })

export const PermissionType = {
  Entity: 'Entity',
  Group: 'Group'
}

export class PermissionsStore {
    @observable entityPermissions = []

    @observable groupPermissions = []

    @observable selectedFilePermissions = []

    @observable selectedPermission = {}

    @observable isSelectedFilePublic = false

    _datastore

    _mainStore

    constructor(datastore, mainStore) {
      this._datastore = datastore
      this._mainStore = mainStore

      this.initialize()
    }

    async initialize() {
      observe(this._mainStore, 'selectedFile', async () => {
        if (!this._mainStore.selectedFile)
          return

        this.initialSelectedFilePermissions =
          (await this._datastore.getFilePermissions(this._mainStore.selectedFile.id))
            .map(permission => ({
              permissionType: PermissionType.Entity,
              ...permission
            }))
            .concat(await this._datastore.getFileGroupPermissions(this._mainStore.selectedFile.id))
            .map(permission => ({
              permissionType: PermissionType.Group,
              ...permission
            }))

        this.selectedFilePermissions = [...this.initialSelectedFilePermissions]

        this.isSelectedFilePublic = this._mainStore.selectedFile.isPublic
      })
    }

    async addPermission(permission) {
      if (permission.permissionType === PermissionType.Entity) {
        await this._datastore.setEntityPermissions(
          this._mainStore.selectedFile.id,
          permission.entity,
          permission.read,
          permission.write
        )
      } else if (permission.permissionType === PermissionType.Group) {
        await this._datastore.setGroupPermissions(
          this._mainStore.selectedFile.id,
          permission.group.id,
          permission.read,
          permission.write
        )
      }
      this._mainStore.isAddPermissionPanelOpen = false
    }

    isPermissionSelected = permission => permission === this.selectedPermission

    async removeSelectedPermission() {
      if (this.selectedPermission.permissionType === PermissionType.Entity) {
        await this._datastore.removeEntityFromFile(
          this._mainStore.selectedFile.id,
          this.selectedPermission.entity
        )
      } else {
        await this._datastore.removeGroupFromFile(
          this._mainStore.selectedFile.id,
          this.selectedPermission.groupId
        )
      }
    }

    async updateSelectedFilePermissions(updatedPermission) {
      this.selectedFilePermissions = this.selectedFilePermissions.map((perm) => {
        if (updatedPermission.permissionType === PermissionType.Entity)
          return perm.entity === updatedPermission.entity ? updatedPermission : perm
        else
          return perm.groupId === updatedPermission.groupId ? updatedPermission : perm
      })
    }

    async savePermissionChanges() {
      const permissionChanges = this._getPermissionChanges()

      await this._datastore.setPermissions(
        this._mainStore.selectedFile.id,
        permissionChanges.filter(perm => perm.permissionType === PermissionType.Entity),
        permissionChanges.filter(perm => perm.permissionType === PermissionType.Group),
        this.isSelectedFilePublic
      )

      this._mainStore.setEditMode(EditMode.None)
    }

    selectPermission(permission) {
      this.selectedPermission = permission !== this.selectedPermission
        ? permission : null
    }

    _getPermissionChanges() {
      return this.selectedFilePermissions.filter((perm, i) => this.initialSelectedFilePermissions[i].write !== perm.write
            || this.initialSelectedFilePermissions[i].read !== perm.read)
    }
}
