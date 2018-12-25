import React from 'react'
import styled from 'styled-components'
import { TableCell } from '@aragon/ui'
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import { getClassNameForFile } from '../utils/files'
import { SelectableRow } from './selectable-row'
import { EthAddress } from './eth-address'
import { Label } from './label'

fontawesome.library.add(solid.faDownload)
fontawesome.library.add(solid.faFolder)


export const FileRow = ({ file, onClick, onLabelClick, onDownloadClick, onOpenClick, selected }) =>
  <Container {...{
    onClick,
    selected,
    onDoubleClick: getDoubleClickCallback(file, preventDefault(onOpenClick))
  }}
  >
    <NameCell>
      <Name>
        <FontAwesomeIcon icon={getClassNameForFile(file)} />
        {file.isFolder ?
          <FolderName onClick={preventDefault(onOpenClick)}>{file.name}</FolderName>
          :
          <FileName>{file.name}</FileName>
        }
        {file.labels.map(label =>
          <Label
            label={label}
            onClick={preventDefault(() => onLabelClick && onLabelClick(label))}
          />
        )}
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
    <TableCell onClick={preventDefault(onDownloadClick)}>
      { !file.isFolder ?
        <DownloadIco className="fa fa-download" />
        :
        <span onClick={preventDefault(onOpenClick)} />
      }
    </TableCell>
  </Container>


/**
 * Returns a function that stops event propagation
 * as soon as its called
 * @param {Function} cb Callback function
 */
function preventDefault(cb) {
  return (e) => {
    e.stopPropagation()
    cb && cb()
  }
}

function getDoubleClickCallback(file, cb) {
  return file.isFolder
    ? cb
    : () => 0
}


const Container = styled(SelectableRow)`
`
const Name = styled.div`
  min-width: 240px;
`
const FileName = styled.div`
  display: inline-block;
  margin-right: 16px;
  margin-left: 8px;
`
const FolderName = styled.div`
  display: inline-block;
  margin-right: 16px;
  margin-left: 8px;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
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