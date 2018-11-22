import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { observe } from 'mobx'
import styled from 'styled-components'

import { Field, TextInput, Button, RadioButton } from '@aragon/ui'
import { TwitterPicker } from 'react-color'
import { LargeDropDown } from './large-inputs'
import { CheckButton } from './check-button'
import { PermissionType } from '../stores/permissions-store'
import { ColorBox } from './label-screen/color-box'

@inject("mainStore", "labelStore")
@observer
export class AddLabelPanel extends Component {
    state = {
      labelName: '',
      isColorPickerVisible: false,
      selectedColor: '#8ED1FC'
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

    closeColorBox = (e) => {
      this.setState({ isColorPickerVisible: false })
    }

    onColorBoxClick = (e) => {
      e.stopPropagation()
      e.preventDefault()
      this.setState({ isColorPickerVisible: !this.state.isColorPickerVisible })
    }

    onColorPickerChange = (color) => {
      this.setState({ selectedColor: color.hex })
    }

    clear() {
      this.setState({
        labelName: '',
        isColorPickerVisible: false,
        selectedColor: '#8ED1FC'
      })
    }

    render() {
      return (
        <Main onClick={this.closeColorBox}>
          <form onSubmit={event => event.preventDefault()}>
            <PermissionField label="Label Name:">
              <StyledTextInput
                value={this.state.labelName}
                onChange={e => this.setState({ labelName: e.target.value })}
                title="Label Name"
                maxLength="28"
                required
              />
            </PermissionField>

            <PermissionField label="Label Color:">
              <ColorBoxPicker color={this.state.selectedColor} onClick={this.onColorBoxClick} />

              {this.state.isColorPickerVisible &&
                <TwitterPicker onChangeComplete={this.onColorPickerChange} />
              }
            </PermissionField>

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

const ColorBoxPicker = styled(ColorBox)`
  cursor: pointer;
`
