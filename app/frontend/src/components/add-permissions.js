import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { observe } from 'mobx'
import styled from 'styled-components'

import { Field, TextInput, RadioButton } from '@aragon/ui'
import { ActionButton } from './action-button'
import { LargeDropDown } from './large-inputs'
import { PermissionType } from '../stores/permissions-store'
import { EditMode } from '../stores/edit-mode'
import { validateEthAddress } from '../utils'

@inject("mainStore", "permissionsStore")
@observer
export class AddPermissions extends Component {
    state = {
      entityAddress: '',
      permissionType: PermissionType.Entity,
      selectedGroupIndex: 0
    }

    constructor(props) {
      super(props)

      observe(props.mainStore, 'isAddPermissionPanelOpen', () => {
        if (props.mainStore.isAddPermissionPanelOpen)
          this.clear()
      })
    }

    get groups() { return this.props.mainStore.availableGroups }

    onSaveClick = () => {
      if (validateEthAddress(this.state.entityAddress) || this.state.permissionType !== PermissionType.Entity) {
        this.props.permissionsStore.addPermission({
          permissionType: this.state.permissionType,
          entity: this.state.entityAddress,
          group: this.props.mainStore.groups[this.state.selectedGroupIndex]
        })
      }
    }

    clear() {
      this.setState({
        entityAddress: '',
        permissionType: PermissionType.Entity,
        selectedGroupIndex: 0
      })
    }

    render() {
      return (
        <Main>
          <form onSubmit={event => event.preventDefault()}>
            <RadioButton
              checked={this.state.permissionType === PermissionType.Entity}
              onClick={() => this.setState({ permissionType: PermissionType.Entity })}
            /> Add a member
            <RadioButton
              style={{ marginLeft: '16px' }}
              checked={this.state.permissionType === PermissionType.Group}
              onClick={() => this.setState({ permissionType: PermissionType.Group })}
            /> Add a group

            { this.state.permissionType === PermissionType.Entity ?
              <PermissionField label="Entity address:">
                <StyledTextInput
                  value={this.state.entityAddress}
                  onChange={e => this.setState({ entityAddress: e.target.value })}
                  title="Use a valid Ethereum address."
                  pattern="0[xX][0-9a-fA-F]+" 
                  required
                />
              </PermissionField>
              :
              <PermissionField label="Group:">
                {this.props.mainStore.groups.length > 0 ?
                  (<LargeDropDown
                    items={this.props.mainStore.groups.map(group => group.name)}
                    active={this.state.selectedGroupIndex}
                    onChange={selectedIndex => this.setState({ selectedGroupIndex: selectedIndex })}
                  />)
                  :
                  (<SaveButton style={{ "margin-top": "8px" }} onClick={() => { this.props.mainStore.setEditMode(EditMode.None);this.props.mainStore.isGroupsSectionOpen = true; } }>Create New Group</SaveButton>)
                }
              </PermissionField>
            }
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
const SaveButton = styled(ActionButton)
  .attrs({ wide: true })`
  margin-top: 40px;
`
