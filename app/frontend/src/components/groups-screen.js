import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { Table, TableHeader, TableRow, Text } from '@aragon/ui'

import { AppLayout } from './app-layout'
import { GroupRow } from './group-row'
import { SideBarGroups } from './side-bar-groups'

export const GroupsScreen = inject("mainStore")(observer(({ mainStore }) =>
  <Main>
    <Title>Group List</Title>

    <AppLayout.ScrollWrapper>
      <AppLayout.Content>
        <TwoPanels>
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
          <SideBarGroups group={mainStore.selectedGroup} />
        </TwoPanels>
      </AppLayout.Content>
    </AppLayout.ScrollWrapper>
  </Main>
))

const Main = styled.div`
  padding-top: 30px;
  padding-left: 50px;
`
const Title = styled(Text).attrs({ size: 'xlarge' })`
  margin-left: 16px;
  display: block;
`
const TwoPanels = styled.div`
  display: flex;
  width: 100%;
  min-width: 800px;
`