import { observable, observe, action } from 'mobx'


export class LabelStore {
    @observable availabelLabels = [{
      id: 1,
      name: 'label 1',
      color: '#333333'
    },
    {
      id: 2,
      name: 'label 2',
      color: 'red'
    }]

    @observable selectedLabel = null

    isLabelSelected = label => this.selectedLabel && this.selectedLabel.id === label.id

    @action selectLabel(label) {
      if (this.selectedLabel && this.selectedLabel.id === label.id)
        this.selectedLabel = null
      else
        this.selectedLabel = label
    }

    @action async createLabel(name, color) {
      await this._datastore.createLabel(name, color)
    }

    @action deleteLabel(labelId) {
      this._datastore.deleteLabel(labelId)
    }

    _datastore

    _mainStore

    constructor(datastore, mainStore) {
      this._datastore = datastore
      this._mainStore = mainStore

      this.initialize()
    }

    async initialize() {
      await this._refreshAvailableLabels()
    }

    async _refreshAvailableLabels() {
      this.availabelLabels = await this._datastore.getLabels()
    }
}
