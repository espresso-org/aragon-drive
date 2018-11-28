import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { DropDown, SidePanelSeparator, Button } from '@aragon/ui'
import { LargeDropDown } from './large-inputs'
import { DeletableLabel } from './deletable-label'
import { Label } from './label'
import { ActionButton } from './action-button'


@inject("mainStore", "labelStore")
@observer
export class EditFileLabels extends Component {
  state = {
    selectedLabelIndex: 0
  }

  onLabelDropdownChange = labelIndex => this.setState({ selectedLabelIndex: labelIndex })

  onAddLabelClick = () => this.labelStore.assignLabel(this.mainStore.selectedFile.id, this.selectedLabel.id)

  get availableLabels() { return this.labelStore.availableLabels.filter(label => !this.mainStore.selectedFile.labels.some(l => l.id === label.id)) }

  get selectedLabel() { return this.availableLabels[this.state.selectedLabelIndex] }

  get mainStore() { return this.props.mainStore }

  get labelStore() { return this.props.labelStore }

  render() {
    return (
      <Main>

        {this.mainStore.selectedFile.labels
          .map(label =>
            <DeletableLabel
              label={label}
              onDeleteClick={() => this.labelStore.unassignLabel(this.mainStore.selectedFile.id, label.id)}
            />
          )}

        <AddBox>
          <LargeDropDown
            items={this.availableLabels.map(label => <Label label={label} />)}
            active={this.state.selectedLabelIndex}
            onChange={this.onLabelDropdownChange}
          />
          <AddLabelButton
            onClick={this.onAddLabelClick}
          >
            Add Label
          </AddLabelButton>
        </AddBox>

        <Actions>
          <ActionButton onClick={() => this.mainStore.isAddLabelPanelOpen = true}>Create New Label</ActionButton>
        </Actions>
      </Main>)
  }
}


const Main = styled.div`
        
    `

const Actions = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`

const AddBox = styled.div`
  margin-top: 20px;
`


const AddLabelButton = styled(Button)
  .attrs({
    mode: 'strong',
    wide: true
  })`
  margin-top: 20px;    
`
