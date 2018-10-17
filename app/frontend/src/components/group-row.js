import React from 'react'
import styled from 'styled-components'
import { TableCell } from '@aragon/ui'
import { SelectableRow } from './selectable-row'

function getEntitiesLength(entities) {
  let counter = 0;
  for (let i = 0; i < entities.length; i++) {
    if (entities[i] !== '0x0000000000000000000000000000000000000000')
      counter++
  }
  return counter
}

export const GroupRow = ({ group, onClick, selected }) =>
  <Container {...{ onClick, selected }}>
    <Cell>
      <InCell>{group.name}</InCell>
    </Cell>
    <Cell>
      <InCell>{getEntitiesLength(group.entities)}</InCell>
    </Cell>
  </Container>

const Container = styled(SelectableRow)`
`
const InCell = styled.div`
    min-width: 240px;
`
const Cell = styled(TableCell)`
    min-width: 180px;
    width: 100%;
`