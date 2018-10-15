import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'

import { Field } from '@aragon/ui'
import { LargeTextInput, SaveButton } from './large-inputs'

@inject("mainStore")
@observer
export class EditFileName extends Component {
  state = { newFilename: '' }

  constructor(props) {
    super(props)
    this.state = { newFilename: props.file && props.file.name }
  }

  get mainStore() { return this.props.mainStore }

  render() {
    return (
      <Main>
        <Field label="New file name:">
          <LargeTextInput value={this.state.newFilename} onChange={e => this.setState({ newFilename: e.target.value })} />
        </Field>

        <SaveButton
          onClick={() => this.mainStore.setFileName(this.props.file.id, this.state.newFilename)}
        >
            Rename
        </SaveButton>

      </Main>
    )
  }
}

const Main = styled.div`
`