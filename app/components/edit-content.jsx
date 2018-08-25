import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'

import { Field, Button, TextInput } from '@aragon/ui'
import { FileInput } from '@espresso-org/drive-components'

import { convertFileToArrayBuffer } from '../utils/files'
import { EditMode } from '../stores/edit-mode'

const Main = styled.div`
    
`
@inject("mainStore")
@observer
export class EditContent extends Component {
  state = { newFilename: '' }

  get mainStore() { return this.props.mainStore }

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
            <ActionButton mode="outline" onClick={() => this.mainStore.setFileContent(this.props.file.id, this.newFileContent)} emphasis="positive">OK</ActionButton>
            <ActionButton mode="outline" onClick={() => this.mainStore.setEditMode(EditMode.None)} emphasis="negative">Cancel</ActionButton>
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