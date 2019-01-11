export class FileCache {
    _files

    constructor(files = []) {
      this._initialize(files)
    }

    async _initialize(files = []) {
      this._files = new Promise(res => res(this._generateTree(0, files)))
    }

    _generateTree(index, files) {
      const folder = {
        ...(files[index]),
        fileIds: []
      }

      for (const file of files) {
        if (file) {
          if (file.id !== file.parentFolder && file.parentFolder === index) {
            folder.fileIds.push(file.id)
          }

          // If file is a folder and not already handled
          if (file.isFolder && file.id > index) {
            this._generateTree(file.id, files)
          }
        }
      }

      files[index] = folder
      return files
    }

    async addFile(file) {
      this.updateFile(file.id, file)
    }

    async getFolder(id = 0) {
      const folder = await this.getFile(id)

      if (!folder.isFolder)
        throw `File ${id} not a folder`

      return {
        ...folder,
        files: await Promise.all(folder.fileIds.map(fileId => this.getFile(fileId)))
      }
    }

    async getFile(id = 0) {
      return (await this._files)[id]
    }

    async getFilePath(id) {
      const file = await this.getFile(id)

      // Root folder is the only folder to have the same value for both
      // its parentFolderId and its id. The value is 0.
      if (file.parentFolder !== file.id)
        return (await this.getFilePath(file.parentFolder)).concat([file.id])
      else
        return [file.id]
    }

    /**
     * Updates the cache with the new file info
     * If the file is not already in cache, it is added
     * If `file` is nullish, it is removed from the cache
     *
     * @param fileId
     * @param file
     */
    async updateFile(fileId, file) {
      const files = await this._files
      const isFileDeleted = !file
      const isNewFile = !files[fileId]

      this._files = new Promise((res) => {
        const parentFolderId = isFileDeleted
          ? files[fileId].parentFolder
          : file.parentFolder

        if (parentFolderId !== undefined) {
          const parentFolder = files[file.parentFolder]

          if (isFileDeleted)
            parentFolder.fileIds = parentFolder.fileIds.filter(id => id !== fileId)

          else if (!parentFolder.fileIds.includes(fileId))
            parentFolder.fileIds.push(fileId)
        }

        files[fileId] = {
          ...files[fileId],
          ...(isNewFile && file.isFolder ? { fileIds: [] } : null),
          ...file
        }

        res(files)
      })

      return this._files.then(() => null)
    }

    async lockAndUpdateFile(fileId, filePromise) {
      const filesBackup = this._files

      this._files = Promise.all([this._files, filePromise])
        .then(([files, file]) => {
          this._files = new Promise(res => res(files))
          return this.updateFile(fileId, file)
        })
        .then(() => this._files)
        .catch(() => this._files = filesBackup)
    }
}
