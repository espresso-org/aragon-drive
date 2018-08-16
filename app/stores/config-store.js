import { observable, computed, action, decorate } from 'mobx'

class ConfigStore {
    @observable isConfigSectionOpen = false
    @observable isAdvancedConfigOpen = false;
    @observable radioGrpSelectedIndex = 0;
    @observable radioGrpSelectedValue = 'ipfs';

    constructor() {
      window.configStore = this
    }
}

export const configStore = new ConfigStore()