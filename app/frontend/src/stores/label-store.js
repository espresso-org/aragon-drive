import { observable, observe } from 'mobx'


export class LabelStore {
    @observable availabelLabels = []

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
