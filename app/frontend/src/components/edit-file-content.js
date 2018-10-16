import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'

import { FileInput } from './file-input'
import { convertFileToArrayBuffer } from '../utils/files'

@inject("mainStore")
@observer
export class EditFileContent extends Component {
  get mainStore() { return this.props.mainStore }

  uploadFiles = async (e) => {
    const files = e.target.files
    // TODO: Add warning when there are multiple files

    for (const file of files) {
      this.newFileContent = await convertFileToArrayBuffer(file)
    }

    this.mainStore.setFileContent(this.props.file.id, this.newFileContent)
  }

  render() {
    return (
      <Main>
        <FileInput
          style={{ width: '100%', textAlign: 'center' }}
          onChange={this.uploadFiles}
        >
              Upload New Content
        </FileInput>
      </Main>
    )
  }
}

const Main = styled.div` 
`