import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'

import { DropDown, SidePanelSeparator, Button } from '@aragon/ui'
import { DeletableLabel } from './deletable-label'
import { ActionButton } from './action-button'

@inject("mainStore", "labelStore")
@observer
export class EditFileLabels extends Component {
  state = {
    selectedLabelIndex: 0
  }

  onLabelDropdownChange = labelIndex => this.setState({ selectedLabelIndex: labelIndex })

  onAddLabelClick = () => this.labelStore.assignLabel(this.mainStore.selectedFile.id, this.selectedLabel.id)

  get selectedLabel() { return this.labelStore.availableLabels[this.state.selectedLabelIndex] }

  get mainStore() { return this.props.mainStore }

  get labelStore() { return this.props.labelStore }

  render() {
    return (
      <Main>

        <AddBox>
          <LabelDropDown>
            <DropDown
              items={this.labelStore.availableLabels.map(label => label.name)}
              active={this.state.selectedLabelIndex}
              onChange={this.onLabelDropdownChange}
            />
          </LabelDropDown>
          <AddLabelButton
            onClick={this.onAddLabelClick}
          >
          Add Label
          </AddLabelButton>
        </AddBox>

        {this.mainStore.selectedFile.labels
          .map(label =>
            <DeletableLabel
              label={label}
              onDeleteClick={() => this.labelStore.unassignLabel(this.mainStore.selectedFile.id, label.id)}
            />
          )}


        <SidePanelSeparator style={{ marginTop: '32px' }} />

        <Actions>
          <SaveButton onClick={() => this.labelStore.savePermissionChanges()}>Save</SaveButton>
        </Actions>
      </Main>)
  }
}


const Main = styled.div`
        
    `

const Actions = styled.div`
  margin-top: 0px;
  margin-bottom: 20px;
`

const AddBox = styled.div`
  display: flex;
  margin-bottom: 20px;
`

const AddLabelButton = styled(ActionButton).attrs({ emphasis: 'positive' })`
  width: 160px;
  margin: 0;
`

const LabelDropDown = styled.div`
  display: inline-block;
  flex-grow: 1;
  > div {
    width: 100%;
  }

  > div > div {
    width: 100%;
  }  
`


const SaveButton = styled(Button)
  .attrs({
    mode: 'strong',
    wide: true
  })`
  margin-top: 20px;    
`
