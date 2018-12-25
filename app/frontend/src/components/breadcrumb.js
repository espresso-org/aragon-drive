import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'


// TODO: Move component to its own folder and move images in it
export const Breadcrumb = ({ files, selectedFile, ...props }) =>
  <Main {...props}>
    { files.map((file, index) =>
      <span>
        { index === 0 ?
          <FirstFolder key={file.id}>Home</FirstFolder>
          :
          <Folder key={file.id}>{file.name}</Folder>
        }
      </span>
    )}
    { selectedFile &&
      <Folder>{selectedFile.name}</Folder>
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
  margin-right: 4px;
  &:before {
    content: ' / ';
    color: #666;
    margin-left: 2px;
    margin-right: 4px;
    font-weight: 300;
  }  
`

const FirstFolder = styled(Folder)`
  margin-right: 6px;
  &:before {
    content: '';
    margin-left: 2px;
  }    
`

const SelectedFile = styled(Folder)`

`