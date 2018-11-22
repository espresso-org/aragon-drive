import React from 'react'
import styled from 'styled-components'
import { inject } from 'mobx-react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Text, theme } from '@aragon/ui'
import { ColorBox } from './color-box'

import { ActionButton } from '../action-button'

export const SideBar =
  inject("labelStore")(
    ({ labelStore }) =>
      <Main visible={labelStore.selectedLabel}>
        <Tabs>Details</Tabs>

        {labelStore.selectedLabel &&
        <Details>
          {/* <Text size="large">{labelStore.selectedLabel.name}</Text> */}
          <Info>
            <Label>Name</Label>{labelStore.selectedLabel.name}<br />
            <ColorLabel style={{ marginTop: '8px' }}>Color</ColorLabel>
            <ColorBox
              color={`#${labelStore.selectedLabel.color}`}
              size="small"
            />
            <br />
            <br />
          </Info>
          <Separator />

          <Actions>

            <ActionButton
              mode="outline"
              onClick={() => labelStore.delete(labelStore.selectedLabel.id)}
              emphasis="negative"
            >
              Delete Label
            </ActionButton>

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

const ColorLabel = styled(Label)`
  margin-top: 8px;
`

const Actions = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`

const Separator = styled.div`  
  border-bottom: 1px solid ${theme.contentBorder};
`