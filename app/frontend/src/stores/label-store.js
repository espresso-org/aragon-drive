import { observable, observe } from 'mobx'


export class LabelStore {
    @observable availabelLabels = [{
      name: 'label 1',
      color: '#333333'
    }]

    _datastore

    _mainStore

    constructor(datastore, mainStore) {
      this._datastore = datastore
      this._mainStore = mainStore

      this.initialize()
    }

    async initialize() {

    }
}
