import styled from 'styled-components'
import React from 'react'
import { TextInput, Button, DropDown } from '@aragon/ui'

export const LargeTextInput = styled(TextInput)`
    width: 100%;
`

export const SaveButton = styled(Button)
  .attrs({ mode: 'strong', wide: true })`
    margin-top: 20px;    
`

export const LargeDropDown = props =>
  <LargeDropDownContainer {...props}>
    <DropDown {...props} />
  </LargeDropDownContainer>


const LargeDropDownContainer = styled.div`
    width: 100%;
    display: inline-block;

    > div {
        width: 100%;
    }

    > div > div {
        width: 100%;
    }
`
