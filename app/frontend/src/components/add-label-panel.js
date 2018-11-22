import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { observe } from 'mobx'
import styled from 'styled-components'

import { Field, TextInput, Button, RadioButton } from '@aragon/ui'
import { LargeDropDown } from './large-inputs'
import { CheckButton } from './check-button'
import { PermissionType } from '../stores/permissions-store'
import { EditMode } from '../stores/edit-mode'
import { validateEthAddress } from '../utils'

@inject("mainStore", "labelStore")
@observer
export class AddLabelPanel extends Component {
    state = {
      entityAddress: '',
      isRead: false,
      isWrite: false,
      permissionType: PermissionType.Entity,
      selectedGroupIndex: 0
    }

    constructor(props) {
      super(props)

      observe(props.mainStore, 'isAddLabelPanelOpen', () => {
        if (props.mainStore.isAddLabelPanelOpen)
          this.clear()
      })
    }

    onSaveClick = () => {

    }

    clear() {
      this.setState({
        entityAddress: '',
        isRead: false,
        isWrite: false,
        permissionType: PermissionType.Entity,
        selectedGroupIndex: 0
      })
    }

    render() {
      return (
        <Main>
          <form onSubmit={event => event.preventDefault()}>


            <SaveButton onClick={this.onSaveClick} type="submit">Save</SaveButton>
          </form>
        </Main>
      )
    }
}

const Main = styled.div`
`
const PermissionField = styled(Field)`
  margin-top: 10px;
`
const StyledTextInput = styled(TextInput)`
  width: 100%;
`
const SaveButton = styled(Button)
  .attrs({ mode: 'strong', wide: true })`
  margin-top: 40px;
`
