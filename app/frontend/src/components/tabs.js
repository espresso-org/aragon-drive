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
    margin-bottom: 8px;
    flex-wrap: wrap;
`


export const Tab = ({ title, eventKey, children, onSelect }) =>
  <TabContext.Consumer>
    {activeKey =>
      <StyledTab>
        <TabTitle
          onClick={() => onSelect(eventKey)}
          active={activeKey === eventKey}
        >
          {title}
        </TabTitle>
      </StyledTab>
      }
  </TabContext.Consumer>


export const TabContent = ({ eventKey, children }) =>
  <TabContext.Consumer>
    {activeKey =>
      activeKey === eventKey &&
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