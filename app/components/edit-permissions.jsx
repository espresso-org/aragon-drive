import React, { Component } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import { Field, Button, TextInput, Text } from '@aragon/ui'

import { mainStore, EditMode } from '../stores/main-store'

const Main = styled.div`
    
`


@observer
export class EditPermissions extends Component {

  state = { 
    newAddressWrite: '',
    newAddressRead: ''
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Main>
          <Title>Write permissions</Title>
          <Field label="Entity address:">
            <TextInput value={this.state.newAddressWrite} onChange={e => this.setState({ newAddressWrite: e.target.value })} />
            <AddButton onClick={() => mainStore.addWritePermission(this.props.file.id, this.state.newAddressWrite)}>Add</AddButton>
            <RemoveButton onClick={() => mainStore.removeWritePermission(this.props.file.id, this.state.newAddressWrite)}>Remove</RemoveButton>
          </Field>
          <AddressList>
            {this.props.file.permissionAddresses.map(address => 
              <Address key={address}>{address}</Address>
            )}
          </AddressList>
         

          <Title style={{marginTop: '80px'}}>Read permissions</Title>
          <Field label="Entity address:">
            <TextInput value={this.state.newAddressRead} onChange={e => this.setState({ newAddressRead: e.target.value })} />
            <AddButton onClick={() => mainStore.addReadPermission(this.props.file.id, this.state.newAddressRead)}>Add</AddButton>
            <RemoveButton onClick={() => mainStore.removeReadPermission(this.props.file.id, this.state.newAddressRead)}>Remove</RemoveButton>
          </Field>
          <AddressList>
            {
              // TODO
            }
          </AddressList>

          <Actions>            
            <ActionButton mode="outline" onClick={() => mainStore.setEditMode(EditMode.None)} emphasis="positive">OK</ActionButton>
            <ActionButton mode="outline" onClick={() => mainStore.setEditMode(EditMode.None)} emphasis="negative">Cancel</ActionButton>
          </Actions>
      </Main>
    )
  }
}

const Title = styled(Text).attrs({ size: 'xlarge'})`
  display: block;
  margin: 8px 0;
`

const AddButton = styled(Button).attrs({ 
    compact: true, 
    mode: 'outline', 
    emphasis: 'positive' 
  })`
  display: inline-block;
  margin: 0px 4px;
`

const RemoveButton = styled(Button).attrs({ 
  compact: true, 
  mode: 'outline', 
  emphasis: 'negative' 
})`
display: inline-block;
margin: 0px;
`

const AddressList = styled.div`
  margin-top: 12px;
`

const Address = styled.div`
`


const Actions = styled.div`
  margin-top: 40px;
  margin-bottom: 20px;
`

const ActionButton = styled(Button)`
  display: inline-block;
  margin: 8px 10px;
`