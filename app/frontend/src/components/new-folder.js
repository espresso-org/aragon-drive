import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'

import { Field } from '@aragon/ui'
import { LargeTextInput, SaveButton } from './large-inputs'
import { CheckButton } from './check-button'

@inject("mainStore")
@observer
export class NewFolder extends Component {
  state = { filename: '' }

  render() {
    return (
      <Main>
        <form onSubmit={event => event.preventDefault()}>
          <Field label="Folder Name:">
            <LargeTextInput value={this.state.filename} onChange={e => this.setState({ filename: e.target.value })} required />
          </Field>
          <SaveButton onClick={() => this.props.mainStore.uploadFile(this.state.filename, this.state.publicStatus)} type="submit">Create Folder</SaveButton>
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