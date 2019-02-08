import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { Table, TableHeader, TableRow, Text } from '@aragon/ui'

import { AppLayout } from './app-layout'
import { GroupRow } from './group-row'
import { SideBarGroups } from './side-bar-groups'

export const GroupsScreen = inject("mainStore")(observer(({ mainStore }) =>
  <Main>
    <AppLayout.ScrollWrapper>
      <AppLayout.Content>
        <TwoPanels>
          <TableContainer>
            <Table
              header={
                <TableRow>
                  <TableHeader title="Name" />
                  <TableHeader title="Members" />
                </TableRow>
                      }
            >
              {mainStore.groups.toJS().map(group =>
                group && <GroupRow
                  key={group.id}
                  group={group}
                  selected={mainStore.isGroupSelected(group)}
                  onClick={() => mainStore.selectGroup(group.id)}
                />)}
            </Table>
          </TableContainer>
          <SideBarGroups group={mainStore.selectedGroup} />
        </TwoPanels>
      </AppLayout.Content>
    </AppLayout.ScrollWrapper>
  </Main>
))

const Main = styled.div`
`
const TableContainer = styled.aside`
    width: 100%;
`

const TwoPanels = styled.div`
  display: flex;
  width: 100%;
  min-width: 800px;
`