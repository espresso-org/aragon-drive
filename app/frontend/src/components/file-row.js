import React from 'react'
import styled from 'styled-components'
import { TableCell } from '@aragon/ui'
import moment from 'moment'
import { getIconForFile } from '../utils/files'
import { SelectableRow } from './selectable-row'
import { IdentityBadge } from './identity-badge'
import { Label } from './label'

export const FileRow = ({ file, onClick, onLabelClick, onDownloadClick, onOpenClick, selected }) =>
  <Container {...{
    onClick,
    selected,
    onDoubleClick: getDoubleClickCallback(file, preventDefault(onOpenClick))
  }}
  >
    <NameCell>
      <Name>
        {getIconForFile(file)}
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
      <IdentityBadge ethAddress={file.owner} />
    </OwnerCell>
    <PermissionsCell>
      {file.permissions.write ? 'Yes' : 'No'}
    </PermissionsCell>
    <LastModifCell>
      {moment(file.lastModification).format('YYYY-MM-DD')}
    </LastModifCell>
    <TableCell>
      { !file.isFolder ?
        <DownloadIco onClick={preventDefault(onDownloadClick)}><DownloadIconBtn /></DownloadIco>
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
const DownloadIconBtn = styled.img.attrs({
  src: require('../images/download.svg'),
  width: "28px",
  height: "28px"
})`
  margin-top: 1px;
`
const DownloadIco = styled.div`
  width: 32px;
  height: 32px;
  cursor: pointer;
  background-position: center;
  transition: background 0.8s;
  border-radius: 50%;
  text-align: center;
  &:hover {
    background: #cccccc radial-gradient(circle, transparent 1%, #cccccc 1%) center/15000%;
  }
  &:active {
    background-color: #f2f2f2;
    background-size: 100%;
    transition: background 0s;  
  }
`