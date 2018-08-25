import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import Switch from 'literal-switch'

import { SidePanel } from '@aragon/ui'
import { EditName } from './edit-name'
import { EditContent } from './edit-content'
import { EditPermissions } from './edit-permissions'

import { EditMode } from '../stores/edit-mode'

const Content = styled.div`
    margin-top: 20px;
`

export const EditPanel = 
  inject("mainStore")(
  observer(({ mainStore }) =>
    <SidePanel
      title={title(mainStore.editMode)}
      opened={mainStore.editMode !== EditMode.None}
      onClose={() => mainStore.editMode = EditMode.None}>
      <Content>
        {mainStore.selectedFile && 
        Switch({
          [EditMode.None]: null,
          [EditMode.Name]: () => <EditName file={mainStore.selectedFile}/>,
          [EditMode.Content]: () => <EditContent file={mainStore.selectedFile}/>,
          [EditMode.Permissions]: () => <EditPermissions file={mainStore.selectedFile}/>
        }, mainStore.editMode)}
      </Content>
    </SidePanel>
  ))

function title(editMode) {
  switch (editMode) {
    case EditMode.None: return ''
    case EditMode.Name: return 'Change file name'
    case EditMode.Content: return 'Change file content'
    case EditMode.Permissions: return 'Manage permissions'
  }
}