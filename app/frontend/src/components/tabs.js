import React from 'react'
import styled from 'styled-components'
import { theme } from '@aragon/ui'

const TabContext = React.createContext();

export const Tabs = ({ activeKey, children, onSelect }) =>
  <StyledTabs>
    <TabContext.Provider value={{ onSelect, activeKey }}>
      {children}
    </TabContext.Provider>
  </StyledTabs>

const StyledTabs = styled.div`
    display: flex;
    margin-bottom: 8px;
    flex-wrap: wrap;
`

export const Tab = ({ tabKey, children }) =>
  <TabContext.Consumer>
    {({ activeKey, onSelect }) =>
      <StyledTab>
        <TabTitle
          onClick={() => onSelect(tabKey)}
          active={activeKey === tabKey}
        >
          {children}
        </TabTitle>
      </StyledTab>
      }
  </TabContext.Consumer>

export const TabContent = ({ tabKey, children }) =>
  <TabContext.Consumer>
    {({ activeKey }) =>
      activeKey === tabKey &&
      <StyledTabContent>
        {children}
      </StyledTabContent>
    }
  </TabContext.Consumer>

const StyledTab = styled.div`
`
const StyledTabContent = styled.div`
  border-top: 1px solid ${theme.contentBorder};
  width: 100%;
`
const TabTitle = styled.div(({ active }) => `
    height: 34px;
    border-bottom: 4px solid transparent;
    border-bottom-color: ${active ? theme.accent : 'transprent'};
    cursor: pointer;
    padding: 0 14px;
    transition: border-bottom 0.25s ease-out;
`)