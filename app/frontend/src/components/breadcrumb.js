import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'


// TODO: Move component to its own folder and move images in it
export const Breadcrumb = ({ files, selectedFile, ...props }) =>
  <Main {...props}>
    / { selectedFile && selectedFile.name}
  </Main>

const Main = styled.div`
  font-size: 21px;
  color: #000;
`