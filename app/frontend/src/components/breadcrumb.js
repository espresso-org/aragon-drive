import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'


// TODO: Move component to its own folder and move images in it
export const Breadcrumb = ({ files, selectedFile, ...props }) =>
  <Main {...props}>
    { files.map(file =>
      <Folder>{file.name}</Folder>
    )}
    { selectedFile &&
      <SelectedFile>{selectedFile.name}</SelectedFile>
    }
  </Main>

const Main = styled.div`
  font-size: 21px;
  color: #000;
  height: 31px;
`

const Folder = styled.div`
  display: inline-block;
  font-size: 21px;
  color: #000;
`

const SelectedFile = styled.div`
  display: inline-block;
  font-size: 21px;
  color: #000;
  margin-left: 2px;
  &:before {
    content: ' > ';
    color: #999;
    font
  }
`