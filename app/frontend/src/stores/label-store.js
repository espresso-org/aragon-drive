import { observable, observe, action } from 'mobx'


export class LabelStore {
    @observable availableLabels = [{
      id: 1,
      name: 'label 1',
      color: '333333'
    },
    {
      id: 2,
      name: 'label 2',
      color: '2354AA'
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

    @action unassignLabel(fileId, labelId) {
      this._datastore.unassignLabel(fileId, labelId)
    }

    _datastore

    _mainStore

    constructor(datastore, mainStore) {
      this._datastore = datastore
      this._mainStore = mainStore

      this.initialize()
    }

    async initialize() {
      return new Promise(async (res) => {
        (await this._datastore.events()).subscribe((event) => {
          switch (event.event) {
            case 'LabelChange':
              this._refreshAvailableLabels()
              break
          }
        });

        this._refreshAvailableLabels()
        res()
      })
    }

    async _refreshAvailableLabels() {
      this.availableLabels = await this._datastore.getLabels()
    }
}
