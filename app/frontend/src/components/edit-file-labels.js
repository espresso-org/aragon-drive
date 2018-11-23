import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'

import { DropDown, SidePanelSeparator, Button } from '@aragon/ui'
import { DeletableLabel } from './deletable-label'
import { ActionButton } from './action-button'

export const EditFileLabels =
inject("mainStore", "labelStore")(
  observer(({ mainStore, labelStore }) =>
    <Main>

      <AddBox>
        <LabelDropDown>
          <DropDown
            items={labelStore.availableLabels.map(label => label.name)}
            active={1}
            onChange={() => 1}
          />
        </LabelDropDown>
        <AddLabelButton>Add Label</AddLabelButton>
      </AddBox>

      {mainStore.selectedFile.labels
        .map(label =>
          <DeletableLabel label={label} />
        )}


      <SidePanelSeparator style={{ marginTop: '32px' }} />

      <Actions>
        <SaveButton onClick={() => labelStore.savePermissionChanges()}>Save</SaveButton>
      </Actions>
    </Main>)
)

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
