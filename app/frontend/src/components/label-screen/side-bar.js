import React from 'react'
import styled from 'styled-components'
import { inject } from 'mobx-react'
import { theme } from '@aragon/ui'
import { ColorBox } from './color-box'
import { ActionButton } from '../action-button'
import { Tabs, Tab, TabContent } from '../tabs'

export const SideBar =
  inject("labelStore")(
    ({ labelStore }) =>
      <Main visible={labelStore.selectedLabel}>
        <Tabs activeKey={0}>
          <Tab tabKey={0}>Details</Tab>
          <StyledPanelCloseButton
            onClick={() => labelStore.selectedLabel = null}
            src={require('../../images/close.svg')}
            alt="Close"
          />

          <TabContent tabKey={0}>
            {labelStore.selectedLabel &&
            <Details>
              <Info>
                <Label>Name</Label>{labelStore.selectedLabel.name}<br />
                <ColorLabel style={{ marginTop: '8px' }}>Color</ColorLabel>
                <ColorBox
                  color={`#${labelStore.selectedLabel.color}`}
                  size="small"
                />
                <br /><br />
              </Info>
              <Separator />

              <Actions>
                <ActionButton
                  mode="outline"
                  onClick={() => labelStore.deleteLabel(labelStore.selectedLabel.id)}
                  emphasis="negative"
                >
                  Delete
                </ActionButton>
              </Actions>
            </Details>
            }
          </TabContent>
        </Tabs>
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
const StyledPanelCloseButton = styled.img`
  position: absolute;
  right: 10px;
  top: 0.2em;
  width: 10px;
  height: 10px;
  cursor: pointer;
`