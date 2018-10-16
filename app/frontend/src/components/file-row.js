import React from 'react'
import styled from 'styled-components'
import { TableCell } from '@aragon/ui'
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import { getClassNameForFilename } from '../utils/files'
import { SelectableRow } from './selectable-row'
import { EthAddress } from './eth-address'

fontawesome.library.add(solid.faDownload)

export const FileRow = ({ file, onClick, onDownloadClick, selected }) =>
  <Container {...{ onClick, selected }}>
    <NameCell>
      <Name>
        <FontAwesomeIcon icon={getClassNameForFilename(file.name)} /> {file.name}
      </Name>
    </NameCell>
    <OwnerCell>
      <EthAddress ethAddress={file.owner} />
    </OwnerCell>
    <PermissionsCell>
      {file.permissions.read && 'Read'}
      {file.permissions.read && file.permissions.write && ', '}
      {file.permissions.write && 'Write'}
    </PermissionsCell>
    <LastModifCell>
      {moment.unix(file.lastModification.toNumber()).format('YYYY-MM-DD')}
    </LastModifCell>
    <TableCell onClick={onDownloadClick}>
      <DownloadIco className="fa fa-download" />
    </TableCell>
  </Container>


const Container = styled(SelectableRow)`
`
const Name = styled.div`
  min-width: 240px;
`
const NameCell = styled(TableCell)`
  min-width: 180px;
  width: 100%;
`
const OwnerCell = styled(TableCell)`
  min-width: 130px;
  width: 130px;
`
const PermissionsCell = styled(TableCell)`
  min-width: 117px;
  width: 117px;
`
const LastModifCell = styled(TableCell)`
  min-width: 135px;
  width: 135px;
`
const DownloadIco = styled.i`
  /*width: 64px;
  height: 64px;*/
`