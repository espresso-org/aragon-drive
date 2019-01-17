import React from 'react'
import styled from 'styled-components'
import { theme } from '@aragon/ui'


export const Tabs = ({ activeKey, children }) =>
  <StyledTabs>
    {children}
  </StyledTabs>


const StyledTabs = styled.div`
    display: flex;
    border-bottom: 1px solid ${theme.contentBorder};
    padding-bottom: 8px;
`


export const Tab = ({ title, eventKey, children }) =>
  <StyledTab>
    <TabTitle>{title}</TabTitle>
    {children}
  </StyledTab>


const StyledTab = styled.div`

`

const TabTitle = styled.div`

`