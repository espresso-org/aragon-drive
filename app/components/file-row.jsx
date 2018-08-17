import React from 'react'
import styled from 'styled-components'
import { TableRow, TableCell } from '@aragon/ui'
import { EthAddress } from '@espresso-org/drive-components'
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import { getClassNameForFilename } from '../utils/files'
import moment from 'moment'


fontawesome.library.add(solid.faDownload)

const Container = styled(TableRow)`
  cursor: pointer;
  > * {
    background: ${ props => props.selected ? '#e3f7f5' : '#FFF' };
  }
`

const Name = styled.div`
  min-width: 440px;
`

const OwnerCell = styled(TableCell)`
  max-width: 200px;
  width: 200px;
`

const DownloadIco = styled.i`
  /*width: 64px;
  height: 64px;*/
`

export const FileRow = ({ file, onClick, onDownloadClick, selected }) => 
  <Container {...{ onClick, selected }}>
    <TableCell>
      <Name>
        <i className={`fa ${getClassNameForFilename(file.name)}`} /> {file.name}
      </Name>
    </TableCell>
    <OwnerCell>
      <EthAddress ethAddress={file.owner} />
    </OwnerCell>
    <TableCell>
      {file.permissions.read && 'Read'}
      {file.permissions.read && file.permissions.write && ', '}
      {file.permissions.write && 'Write'}
    </TableCell>            
    <TableCell>
      {moment.unix(file.lastModification.toNumber()).format('YYYY-MM-DD')}
    </TableCell> 
    <TableCell onClick={onDownloadClick}>
      <DownloadIco className="fa fa-download" />    
    </TableCell>
  </Container>
