import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import filesize from 'filesize/lib/filesize'
import { inject, observer } from 'mobx-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Text, theme } from '@aragon/ui'
import { EthAddress } from './eth-address'
import { FileInputChange } from './file-input-change'
import { getDescriptionForFile, getClassNameForFile, getFileName } from '../utils/files'
import { Tabs, Tab, TabContent } from './tabs'
import { ActionButton } from './action-button'
import { EditMode } from '../stores/edit-mode'

export const SideBar =
  inject("mainStore")(
    observer(({ file, mainStore }) =>
      <Main visible={file ? true : false} isFolder={file && file.isFolder}>
        {file &&
        <Tabs activeKey={mainStore.selectedTab} onSelect={tabKey => mainStore.selectedTab = tabKey}>
          <Tab tabKey={0}>Details</Tab>
          <Tab tabKey={1}>Comments</Tab>

          <TabContent tabKey={0}>
            <Details>
              <Text size="large">{file.name}</Text>
              <Info>
                <Label>Type</Label><FontAwesomeIcon icon={getClassNameForFile(file)} /> {getDescriptionForFile(file)}<br />
                <Label>Location</Label>{ file.parentFolderInfo && getFileName(file.parentFolderInfo)}<br />

                <Label>Owner</Label>
                <EthAddressDetails><EthAddress ethAddress={file.owner} /></EthAddressDetails>

                <Label>Write</Label>
                {file.permissions.write ? 'Yes' : 'No'}
                <br />
                <Label>Modified</Label>{moment(file.lastModification).format('MMM D YYYY')}<br />
                {!file.isFolder &&
                <div><Label>File size</Label>{filesize(file.fileSize)}<br /></div>
            }
                <br />
              </Info>
              <Separator />

              <Actions>
                {file.permissions.write &&
                <div>
                  <ActionButton onClick={() => mainStore.setEditMode(EditMode.Name)}>Rename</ActionButton>
                  {!file.isFolder &&
                  <FileInputChange onChange={e => mainStore.openChangeFileContentPanel(e)}>Change File Content</FileInputChange>
                }
                </div>
            }
                {file.isOwner &&
                <div>
                  <ActionButton onClick={() => { mainStore.setEditMode(EditMode.Labels) }}>Labels</ActionButton>
                  <ActionButton onClick={() => mainStore.setEditMode(EditMode.Permissions)}>Write Permissions</ActionButton>
                  <ActionButton mode="outline" onClick={() => mainStore.deleteFile()} emphasis="negative">Delete</ActionButton>
                </div>
            }
              </Actions>
            </Details>
          </TabContent>
          <TabContent tabKey={1}>comments</TabContent>
        </Tabs>
      }
      </Main>
    )
  )

const Main = styled.aside`
  flex-shrink: 0;
  flex-grow: 0;
  width: 300px;
  margin-left: 30px;
  min-height: 100%;
  margin-right: ${({ visible }) => visible ? 0 : '-340px'};
  transition: margin-right 300ms cubic-bezier(0.4,0.0,0.2,1);
  /*transition-delay: ${({ visible, isFolder }) => visible && isFolder ? '100ms' : 0};*/
  /*transition-delay: ${({ visible }) => visible ? '100ms' : 0};*/
  transition-delay: 100ms;
`
const Tabs2 = styled.div`
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