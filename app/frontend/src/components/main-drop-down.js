import styled from 'styled-components'
import React from 'react'
import { DropDown } from '@aragon/ui'

const arrow = `<svg width='9' height='5' viewBox='0 0 9 5' xmlns='http://www.w3.org/2000/svg'><path d='M0 0h8.36L4.18 4.18z' fill='#ffffff' fill-rule='evenodd'/></svg>`

export const MainDropDown = props =>
  <Main>
    <DropDown {...props} />
  </Main>

const Main = styled.div`
    display: inline-block;
    
    > div > div {
        color: white;
        background-image: url("data:image/svg+xml;utf8,${arrow}"), linear-gradient( 130deg,#00B4E6,#00F0E0 );
        background-position: calc(100% - 15px) 50%, 0 0;
    }
`