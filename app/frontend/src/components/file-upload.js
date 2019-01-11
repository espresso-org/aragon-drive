import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'

import { Field } from '@aragon/ui'
import { LargeTextInput, SaveButton } from './large-inputs'

@inject("mainStore")
@observer
export class FileUpload extends Component {
  state = { filename: '' }

  constructor(props) {
    super(props)
    this.state = { filename: mainStore.uploadedFile.name }
  }

   render() {
    return (
      <Main>
        <form onSubmit={event => event.preventDefault()}>
          <Field label="File Name:">
            <LargeTextInput value={this.state.filename} onChange={e => this.setState({ filename: e.target.value })} required />
          </Field>
          <SaveButton onClick={() => mainStore.uploadFile(this.state.filename)} type="submit">Upload</SaveButton>
        </form>
      </Main>
    )
  }
}

const Main = styled.div`
`