import React, { Component } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import { Field, Button, TextInput } from '@aragon/ui'
import { FileInput } from '@espresso-org/drive-components'

import { convertFileToArrayBuffer } from '../utils/files'
import { mainStore, EditMode } from '../stores/main-store'

const Main = styled.div`
    
`

@observer
export class EditContent extends Component {
  state = { newFilename: '' }

  constructor(props) {
    super(props)
    this.state = { newFilename: props.file && props.file.name }
  }

  uploadFiles = async e => {
    const files = e.target.files
    // TODO: Add warning when there are multiple files

    for (let file of files) {
      this.newFileContent = await convertFileToArrayBuffer(file) 
    }
  }  

  render() {
    return (
      <Main>
          <FileInput onChange={this.uploadFiles}>Upload new content</FileInput>
          <Actions>
            <ActionButton mode="outline" onClick={() => mainStore.setFileContent(this.props.file.id, this.newFileContent)} emphasis="positive">OK</ActionButton>
            <ActionButton mode="outline" onClick={() => mainStore.setEditMode(EditMode.None)} emphasis="negative">Cancel</ActionButton>
          </Actions>
      </Main>
    )
  }
}

const Actions = styled.div`
  margin-top: 40px;
  margin-bottom: 20px;
`

const ActionButton = styled(Button)`
  display: inline-block;
  margin: 8px 10px;
`