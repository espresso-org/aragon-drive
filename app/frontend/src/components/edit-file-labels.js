import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'

import { Table, TableRow, TableHeader, TableCell, SidePanelSeparator, Button } from '@aragon/ui'
import { SelectableRow } from './selectable-row'
import { DeletableLabel } from './deletable-label'

export const EditFileLabels =
inject("mainStore", "labelStore")(
  observer(({ mainStore, labelStore }) =>
    <Main>

      <AddressList
        header={
          <TableRow>
            <TableHeader title="" />
          </TableRow>
        }
      >
        {mainStore.selectedFile.labels
          .map(label =>
            <SelectableRow size="small" selected={false}>
              <TableCell style={{ fontSize: '15px' }}>
                <DeletableLabel label={label} />
              </TableCell>
            </SelectableRow>
          )}
      </AddressList>

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

const AddressList = styled(Table)`
  margin-top: 12px;
  overflow-y: scroll;
  max-height: 150px;
`

const ActionButton = styled(Button)`
  display: inline-block;
  margin: 8px 10px;
`

const SaveButton = styled(Button)
  .attrs({ mode: 'strong', wide: true })`
  margin-top: 20px;    
`
