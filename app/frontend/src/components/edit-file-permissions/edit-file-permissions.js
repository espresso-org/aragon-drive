import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'

import { TableRow, TableHeader, TableCell, SidePanelSeparator } from '@aragon/ui'
import { CheckButton } from '../check-button'
import { PermissionType } from '../../stores/permissions-store'
import { EthAddress } from '../eth-address'
import { SelectableRow } from '../selectable-row'
import { s } from './edit-file-permissions.styles'

export const EditFilePermissions =
inject("mainStore", "permissionsStore")(
  observer(({ mainStore, permissionsStore }) =>
    <s.Main>

      <s.TopButtons>
        <s.AddButton onClick={() => mainStore.isAddPermissionPanelOpen = true}>Add</s.AddButton>
        <s.RemoveButton onClick={() => permissionsStore.removeSelectedPermission()}>Remove</s.RemoveButton>
      </s.TopButtons>
      <s.AddressList
        header={
          <TableRow>
            <TableHeader title="Member / Group" />
            <TableHeader title="Read" />
            <TableHeader title="Write" />
          </TableRow>
        }
      >
        {permissionsStore.selectedFilePermissions
          .map(permission =>
            <PermissionRow
              key={permission.entity || permission.groupId}
              permission={permission}
              onChange={permission => permissionsStore.updateSelectedFilePermissions(permission)}
              selected={permissionsStore.isPermissionSelected(permission)}
              onClick={() => permissionsStore.selectPermission(permission)}
            />)}
      </s.AddressList>

      <SidePanelSeparator style={{ marginTop: '32px' }} />
      <s.Info>
        <s.Label>
            Public :
        </s.Label>
        <CheckButton
          checked={permissionsStore.isSelectedFilePublic}
          onClick={() => { permissionsStore.isSelectedFilePublic = !permissionsStore.isSelectedFilePublic }}
          style={{ verticalAlign: 'middle' }}
        />
      </s.Info>
      {/* <SidePanelSeparator /> */}

      <s.Actions>
        <s.SaveButton onClick={() => permissionsStore.savePermissionChanges()}>Save</s.SaveButton>
      </s.Actions>
    </s.Main>)
)

const PermissionRow = ({ permission, onChange, selected, ...props }) =>
  <SelectableRow size="small" selected={selected} {...props}>
    <TableCell style={{ fontSize: '15px' }}>
      { permission.permissionType === PermissionType.Entity ?
        <StyledEthAddress ethAddress={permission.entity} />
        :
        <span style={{ marginTop: '-3px' }}>{permission.groupName}</span>
      }
    </TableCell>
    <TableCell>
      <Checbox
        onClick={() => onChange({ ...permission, read: !permission.read })}
        checked={permission.read}
      />
    </TableCell>
    <TableCell>
      <Checbox
        checked={permission.write}
        onClick={() => onChange({ ...permission, write: !permission.write })}
      />
    </TableCell>
  </SelectableRow>


const Checbox = styled(CheckButton)`
  margin-top: 2px;
`
const StyledEthAddress = styled(EthAddress)`
  margin-top: -3px;
`