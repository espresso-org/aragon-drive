import { action, observable, configure } from 'mobx'

configure({ isolateGlobalState: true })

export class ConfigStore {
    @observable isConfigSectionOpen = false

    @observable isAdvancedConfigOpen = false

    @observable radioGrpSelectedIndex = 0

    @observable radioGrpSelectedValue

    @observable configSelected = true

    @observable host = 'localhost'

    @observable port = '5001'

    @observable protocolArray = ['HTTP', 'HTTPS']

    @observable protocolIndex = 0

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
            case 'SettingsChange':
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
        }
      }, 1000)
    }

    @action async setSettings(storageProvider, host, port, protocol) {
      if (storageProvider && host && port && protocol)
        await this._datastore.setSettings(storageProvider, host, port, protocol)
    }
}
