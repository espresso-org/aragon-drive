import React from 'react'
import styled from 'styled-components'
import { theme } from '@aragon/ui'

const TabContext = React.createContext();

export const Tabs = ({ activeKey, children }) =>
  <StyledTabs>
    <TabContext.Provider value={activeKey}>
      {children}
    </TabContext.Provider>
  </StyledTabs>


const StyledTabs = styled.div`
    display: flex;
    border-bottom: 1px solid ${theme.contentBorder};
    margin-bottom: 8px;
`


export const Tab = ({ title, eventKey, children, onSelect }) =>
  <StyledTab>
    <TabContext.Consumer>
      {activeKey =>
        <TabTitle
          onClick={() => onSelect(eventKey)}
          active={activeKey === eventKey}
        >
          {title}
        </TabTitle>
      }
    </TabContext.Consumer>
  </StyledTab>


const StyledTab = styled.div`

`

const TabTitle = styled.div(({ active }) => `
    height: 34px;
    border-bottom: 4px solid ${active ? theme.accent : 'transprent'};
    cursor: pointer;
`)