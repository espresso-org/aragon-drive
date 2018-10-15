import styled from 'styled-components'
import { Button } from '@aragon/ui'


export const ActionButton = styled(Button).attrs({ mode: 'outline' })`
    display: block;
    width: 100%;
    margin: 8px 0;
    background-color: ${({ disabled }) => disabled ? 'transparent' : 'white'};
    border-color: ${({ disabled }) => disabled ? '#f1ecec' : '#E6E6E6'};
    color: ${({ disabled }) => disabled ? '#aaa' : '#707070'};
    
    :hover {        
        border-color: ${({ disabled }) => disabled ? '#f1ecec' : '#B3B3B3'};
    }
`
