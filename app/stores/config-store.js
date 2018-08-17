import { observable } from 'mobx'
import { mainStore } from './main-store'

class ConfigStore {
    @observable isConfigSectionOpen = false
    @observable isAdvancedConfigOpen = false
    @observable radioGrpSelectedIndex = 0
    @observable radioGrpSelectedValue = 'ipfs'
    
    @observable host = 'localhost'
    @observable port = '5001'
    @observable protocolArray = ['HTTP', 'HTTPS']
    @observable protocolIndex = 0

    constructor() {
      setTimeout(() => this.initialize(), 1)
      window.configStore = this
    }

    async initialize() { 
      setTimeout(async () => {        
        //if(mainStore.host) {
          this.host = mainStore.host
          this.port = mainStore.port
          this.protocol = mainStore.protocol
          console.log(mainStore.host)
          console.log("TESTTEST" + this.host)
        //}
      }, 1000)
    }
}

export const configStore = new ConfigStore()