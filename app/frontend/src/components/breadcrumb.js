import React from 'react'
import styled from 'styled-components'
import { getFileName } from '../utils/files'

export const Breadcrumb = ({ files, selectedFile, onFolderClick, ...props }) =>
  <Main {...props}>
    { files.map((file, index) =>
      <span>
        { index === 0 ?
          <FirstFolder
            key={file.id}
            onClick={() => onFolderClick(file.id)}
          >
            {getFileName(file)}
          </FirstFolder>
          :
          <Folder
            key={file.id}
            onClick={() => onFolderClick(file.id)}
          >
            {getFileName(file)}
          </Folder>
        }
      </span>
    )}
    { selectedFile &&
      <Folder style={{ cursor: 'initial' }}>{selectedFile.name}</Folder>
    }
  </Main>

const Main = styled.div`
  font-size: 21px;
  color: #000;
  height: 31px;
  margin-left: -5px;
`
const Folder = styled.div`
  display: inline-block;
  font-size: 21px;
  color: #000;
  margin-right: 4px;
  cursor: pointer;
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