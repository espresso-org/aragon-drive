import styled from 'styled-components'
import { TableRow } from '@aragon/ui'

export const SelectableRow = styled(TableRow)`
    cursor: pointer;

    ${({ size }) => {
    switch (size) {
      case 'small': return `
                > td {
                 padding: 8px 0 4px 20px;
                 font-size: 12px;
                }
            `
      case `normal`:
      default: return ``
    }
  }}

    > * {
        background: ${({ selected }) => selected ? 'rgba(220, 234, 239, 0.3)' : 'white'};
    }
`