import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import filesize from 'filesize'
import { EthAddress } from '@espresso-org/drive-components'
import { getDescriptionForFilename, getClassNameForFilename } from '../utils/files'

import { Text, Button, theme } from '@aragon/ui'

import { mainStore, EditMode } from '../stores/main-store'

const Main = styled.aside`
  flex-shrink: 0;
  flex-grow: 0;
  width: 300px;
  margin-left: 30px;
  min-height: 100%;
`

export const SideBar = ({ file }) =>
  <Main>
    <Tabs>Details</Tabs>
      
    {file &&
      <Details>
        <Text size="large">{file.name}</Text>
        <Info>
          <Label>Type</Label><i className={`fa ${getClassNameForFilename(file.name)}`} /> {getDescriptionForFilename(file.name)}<br />
          <Label>Location</Label>/<br />

          <Label>Owner</Label>
          <EthAddressDetailsContainer><EthAddress ethAddress={file.owner} /></EthAddressDetailsContainer>

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
              <ActionButton onClick={() => mainStore.setEditMode(EditMode.Content)}>Modify</ActionButton>
            </div>
          }
          {file.isOwner &&
            <div>
              <ActionButton onClick={() => mainStore.setEditMode(EditMode.Permissions)}>Manage permissions</ActionButton>
              <ActionButton mode="outline" onClick={() => mainStore.deleteFile()} emphasis="negative">Delete</ActionButton>
            </div>
          }
        </Actions>
      </Details>
    }
  </Main>

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

const ActionButton = styled(Button).attrs({ mode: 'secondary'})`
  display: block;
  width: 180px;
  margin: 8px 0;
`

const EthAddressDetailsContainer = styled.span`
  max-width: 140px;
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
`

const Separator = styled.div`  
  border-bottom: 1px solid ${theme.contentBorder};
`