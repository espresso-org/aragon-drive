import { action, observable, configure } from 'mobx'

configure({ isolateGlobalState: true })

export class ConfigStore {
    @observable isConfigSectionOpen = false

    @observable isAdvancedConfigOpen = false

    @observable radioGrpSelectedIndex = 0

    @observable radioGrpSelectedValue = 'ipfs'

    @observable configSelected = true

    @observable host = 'localhost'

    @observable port = '5001'

    @observable protocolArray = ['HTTP', 'HTTPS']

    @observable protocolIndex = 0

    @observable encryptionName

    @observable keyLength

    @observable encryptionAlgorithmArray = ['AES-CBC', 'AES-GCM']

    @observable encryptionKeyLengthArray = [128, 256]

    @observable selectedEncryptionAlgorithm = 0

    @observable selectedEncryptionKeyLength = 0

    _datastore

    constructor(datastore) {
      this._datastore = datastore
      window.configStore = this

      this.initialize()
    }

    async initialize() {
      setTimeout(async () => {
        (await this._datastore.events()).subscribe((event) => {
          console.log('New event: ', event)
          switch (event.event) {
            case 'SettingsChanged':
              this.isConfigSectionOpen = false
              this.configSelected = true
              this.isAdvancedConfigOpen = false
              break
          }
        });

        const datastoreSettings = await this._datastore.getSettings()

        if (datastoreSettings.storageProvider === 0) {
          this.isConfigSectionOpen = true
          this.configSelected = false
        } else {
          // TODO: Handle every possible storage providers
          this.radioGrpSelectedValue = 'ipfs'
          this.host = datastoreSettings.ipfs.host
          this.port = datastoreSettings.ipfs.port
          this.protocolIndex = this.protocolArray.indexOf(datastoreSettings.ipfs.protocol)

          this.encryptionName = datastoreSettings.aes.name
          this.keyLength = datastoreSettings.aes.length
        }
      }, 1000)
    }

    @action async setSettings(host, port, protocol, name, length) {
      if (host && port && protocol && name && length) {
        await this._datastore.setSettings(host, port, protocol, name, length)
        this.encryptionName = name
        this.keyLength = length
      }
    }
}
