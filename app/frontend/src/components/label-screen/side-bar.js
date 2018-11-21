import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import filesize from 'filesize/lib/filesize'
import { inject } from 'mobx-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Text, theme } from '@aragon/ui'
import { EthAddress } from '../eth-address'
import { getDescriptionForFilename, getClassNameForFilename } from '../../utils/files'

import { ActionButton } from '../action-button'

export const SideBar =
  inject("labelStore")(
    ({ labelStore }) =>
      <Main visible={labelStore.selectedFile}>
        <Tabs>Details</Tabs>

        {labelStore.selectedLabel &&
        <Details>
          <Text size="large">{labelStore.selectedLabel.name}</Text>
          <Info>
            <Label>Name</Label>Label name<br />
            <Label>Color</Label>fweaf<br />
            <br />
          </Info>
          <Separator />

          <Actions>

            {/* store.selectedFile.isOwner &&
              <div>
                <ActionButton onClick={() => store.restoreFile(store.selectedFile)}>Restore File</ActionButton>
                <ActionButton
                  mode="outline"
                  onClick={() => store.deletePermanently(store.selectedFile)}
                  emphasis="negative"
                >
                  Delete Permanently
                </ActionButton>
              </div>
            */}
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