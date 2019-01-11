import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'

import { TableRow, TableHeader, TableCell } from '@aragon/ui'
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
  </SelectableRow>

const StyledEthAddress = styled(EthAddress)`
  margin-top: -3px;
`