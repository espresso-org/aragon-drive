import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'

import { Field } from '@aragon/ui'
import { LargeTextInput, SaveButton } from './large-inputs'
import { CheckButton } from './check-button'

@inject("mainStore")
@observer
export class FileUpload extends Component {
  state = { filename: '', publicStatus: false }

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
          <Info>
            <Label>Public :</Label>
            <CheckButton
                checked={this.state.publicStatus}
                onClick={() => this.setState({ publicStatus: !this.state.publicStatus })}
                style={{ verticalAlign: 'middle' }}
            />
          </Info>
          <SaveButton onClick={() => mainStore.uploadFile(this.state.filename, this.state.publicStatus)} type="submit">Upload</SaveButton>
        </form>
      </Main>
    )
  }
}

const Main = styled.div`
`
const Info = styled.div`
    margin-top: 26px;
    margin-bottom: 20px;
    vertical-align: middle;
`
const Label = styled.span`
    display: inline-block;
    color: #707070;
    margin-right: 16px;
`