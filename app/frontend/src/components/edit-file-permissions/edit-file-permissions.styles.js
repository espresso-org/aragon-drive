import styled from 'styled-components'
import { Button, Text, Table, TableRow } from '@aragon/ui'

export const s = {
  Main: styled.div`
        
    `,

  Title: styled(Text).attrs({ size: 'xlarge' })`
        display: block;
        margin: 8px 0;
    `,

  TopButtons: styled.div`
        margin: 10px;
        margin-top: 0px;
    `,

  AddButton: styled(Button).attrs({
    compact: true,
    mode: 'outline',
    emphasis: 'positive'
  })`
        display: inline-block;
        margin: 0px 4px;
    `,

  RemoveButton: styled(Button).attrs({
    compact: true,
    mode: 'outline',
    emphasis: 'negative'
  })`
        display: inline-block;
        margin: 0px;
    `,

  AddressList: styled(Table)`
        margin-top: 12px;
        overflow-y: scroll;
        max-height: 150px;
    `,

  Address: styled(Button)`
        margin-bottom: 2px;
        margin-left: 1px;
        width: 349px;
        font-size: small;
    `,

  Actions: styled.div`
        margin-top: 0px;
        margin-bottom: 20px;
    `,

  ActionButton: styled(Button)`
        display: inline-block;
        margin: 8px 10px;
    `,

  SaveButton: styled(Button)
    .attrs({ mode: 'strong', wide: true })`
        margin-top: 20px;    
    `,

  SelectableRow: styled(TableRow)`
        cursor: pointer;
        > * {
            background: ${({ selected }) => selected ? 'rgba(220, 234, 239, 0.3)' : 'white'};
        }
    `,

  Info: styled.div`
        margin-top: 26px;
        margin-bottom: 20px;
        margin-left: 20px;
        vertical-align: middle;
    `,

  Label: styled.span`
        display: inline-block;
        color: #707070;
        margin-right: 16px;
    `
}