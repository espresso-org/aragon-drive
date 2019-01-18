import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'

import { SaveButton } from './large-inputs'
import { convertFileToArrayBuffer, getExtensionForFilename } from '../utils/files'

@inject("mainStore")
@observer
export class EditFileContent extends Component {
  get mainStore() { return this.props.mainStore }

  uploadFileNewExtension = async (e) => {
    this.newFileContent = await convertFileToArrayBuffer(this.mainStore.uploadedFile)
    let newFileName = this.mainStore.selectedFile.name.substring(0, this.mainStore.selectedFile.name.lastIndexOf('.') + 1) + getExtensionForFilename(this.mainStore.uploadedFile.name)
    this.mainStore.setNewFileContentNewExtension(this.mainStore.selectedFile.id, newFileName, this.newFileContent)
  }

  uploadFileOriginalExtension = async (e) => {
    this.newFileContent = await convertFileToArrayBuffer(this.mainStore.uploadedFile)
    this.mainStore.setFileContent(this.mainStore.selectedFile.id, this.newFileContent)
  }

  render() {
    return (
      <Main>
        <h2 style={{marginBottom: '15px'}}>You uploaded a file with a different format than the original file. Do you want to change the original extension to this new one?</h2>

        <SaveButton style={{marginBottom: '15px'}} onClick={() => this.uploadFileNewExtension()} type="submit">
          Change file extension
        </SaveButton>

        <SaveButton onClick={() => this.uploadFileOriginalExtension()} type="submit">
          Keep original file extension
        </SaveButton>
      </Main>
    )
  }
}

const Main = styled.div` 
`