import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import filesize from 'filesize/lib/filesize'
import { inject } from 'mobx-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Text, theme } from '@aragon/ui'
import { EthAddress } from './eth-address'
import { getDescriptionForFilename, getClassNameForFilename } from '../utils/files'

import { ActionButton } from './action-button'
import { EditMode } from '../stores/edit-mode'

export const SideBar =
  inject("mainStore")(
    ({ file, mainStore }) =>
      <Main visible={file ? true : false}>
        <Tabs>Details</Tabs>

        {file &&
        <Details>
          <Text size="large">{file.name}</Text>
          <Info>
            <Label>Type</Label><FontAwesomeIcon icon={getClassNameForFilename(file.name)} /> {getDescriptionForFilename(file.name)}<br />
            <Label>Location</Label>/<br />

            <Label>Owner</Label>
            <EthAddressDetails><EthAddress ethAddress={file.owner} /></EthAddressDetails>

            <Label>Permissions</Label>
            {file.permissions.read && 'Read'}
            {file.permissions.read && file.permissions.write && ', '}
            {file.permissions.write && 'Write'}
            <br />
            <Label>Modified</Label>{moment.unix(file.lastModification.toNumber()).format('MMM D YYYY')}<br />
            <Label>File size</Label>{filesize(file.fileSize.toNumber())}<br />
          </Info>
          <Separator />

          <Actions>
            {file.permissions.write &&
              <div>
                <ActionButton onClick={() => mainStore.setEditMode(EditMode.Name)}>Rename</ActionButton>
                <ActionButton onClick={() => mainStore.setEditMode(EditMode.Content)}>Change File Content</ActionButton>
              </div>
            }
            {file.isOwner &&
              <div>
                <ActionButton onClick={() => { mainStore.setEditMode(EditMode.Permissions); mainStore.newPublicStatus = mainStore.selectedFile.isPublic; }}>Permissions</ActionButton>
                <ActionButton mode="outline" onClick={() => mainStore.deleteFile()} emphasis="negative">Delete</ActionButton>
              </div>
            }
          </Actions>
        </Details>
      }
      </Main>
  )

const Main = styled.aside`
  flex-shrink: 0;
  flex-grow: 0;
  width: 300px;
  margin-left: 30px;
  min-height: 100%;
  margin-right: ${({ visible }) => visible ? 0 : '-340px'};
  transition: margin-right 300ms cubic-bezier(0.4,0.0,0.2,1);
`
const Tabs = styled.div`
  border-bottom: 1px solid ${theme.contentBorder};
  padding-bottom: 8px;
`
const Details = styled.div`
  margin-top: 20px;
`
const Info = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`
const Label = styled.span`
  display: inline-block;
  color: ${theme.textTertiary};
  width: 112px;
`
const Actions = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`
const EthAddressDetails = styled.span`
  max-width: 140px;
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
`
const Separator = styled.div`  
  border-bottom: 1px solid ${theme.contentBorder};
`