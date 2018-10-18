import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import Switch from 'literal-switch'

import { SidePanel } from '@aragon/ui'
import { EditFileName } from './edit-file-name'
import { EditFileContent } from './edit-file-content'
import { EditFilePermissions } from './edit-file-permissions/edit-file-permissions'
import { EditGroupCreate } from './edit-group-create'
import { EditGroupName } from './edit-group-name'
import { EditGroupMember } from './edit-group-member'
import { EditMode } from '../stores/edit-mode'
import { FileUpload } from './file-upload'

function title(editMode) {
  switch (editMode) {
    case EditMode.None: return ''
    case EditMode.Name: return 'Rename File'
    case EditMode.Content: return 'Change File Content'
    case EditMode.Permissions: return 'Permissions'
    case EditMode.GroupCreate: return 'Create Group'
    case EditMode.GroupName: return 'Rename Group'
    case EditMode.GroupMember: return 'Add Member'
    case EditMode.FileUpload: return 'Upload File'
  }
  return ''
}

export const EditPanel =
  inject("mainStore")(
    observer(({ mainStore }) =>
      <SidePanel
        title={title(mainStore.editMode)}
        opened={mainStore.editMode !== EditMode.None}
        onClose={() => { mainStore.editMode = EditMode.None; mainStore.fileUploadIsOpen = false; }}
      >
        <Content>
          {(mainStore.selectedFile || mainStore.isGroupsSectionOpen || mainStore.fileUploadIsOpen) &&
        Switch({
          [EditMode.None]: null,
          [EditMode.Name]: () => <EditFileName file={mainStore.selectedFile} />,
          [EditMode.Content]: () => <EditFileContent file={mainStore.selectedFile} />,
          [EditMode.Permissions]: () => <EditFilePermissions file={mainStore.selectedFile} />,
          [EditMode.GroupCreate]: () => <EditGroupCreate />,
          [EditMode.GroupName]: () => <EditGroupName group={mainStore.selectedGroup} />,
          [EditMode.GroupMember]: () => <EditGroupMember group={mainStore.selectedGroup} />,
          [EditMode.FileUpload]: () => <FileUpload />
        }, mainStore.editMode)}
        </Content>
      </SidePanel>)
  )

const Content = styled.div`
    margin-top: 20px;
`