import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { observe } from 'mobx'
import styled from 'styled-components'

import { Field, TextInput, Button, RadioButton } from '@aragon/ui'
import { LargeDropDown } from './large-inputs'
import { CheckButton } from './check-button'
import { PermissionType } from '../stores/permissions-store'
import { EditMode } from '../stores/edit-mode'

@inject("mainStore", "permissionsStore")
@observer
export class AddPermissions extends Component {
    state = {
      entityAddress: '',
      isRead: false,
      isWrite: false,
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
      this.props.permissionsStore.addPermission({
        permissionType: this.state.permissionType,
        read: this.state.isRead,
        write: this.state.isWrite,
        entity: this.state.entityAddress,
        group: this.props.mainStore.groups[this.state.selectedGroupIndex]
      })
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
                (<SaveButton style={{ "margin-top": "8px" }} onClick={() => { this.props.mainStore.setEditMode(EditMode.None);this.props.mainStore.isGroupsSectionOpen = true; } }>Create a Group</SaveButton>)
              }
            </PermissionField>
          }
          <CheckButton
            style={{ "margin": "5px" }}
            checked={this.state.isRead}
            onClick={() => this.setState({ isRead: !this.state.isRead })}
          /> Read
          <CheckButton
            style={{ marginLeft: '80px' }}
            checked={this.state.isWrite}
            onClick={() => this.setState({ isWrite: !this.state.isWrite })}
          /> Write

          <SaveButton onClick={this.onSaveClick}>Save</SaveButton>
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
