import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { observe } from 'mobx'
import styled from 'styled-components'

import { Field, Button, SidePanel } from '@aragon/ui'
import { TwitterPicker } from 'react-color'
import { ColorBox } from './label-screen/color-box'
import { LargeTextInput } from './large-inputs'

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
      this.props.labelStore.createLabel(this.state.labelName, this.state.selectedColor)
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
      this.setState({ isColorPickerVisible: false })
    }

    onColorPickerClick = (e) => {
      e.stopPropagation()
      e.preventDefault()
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
        <SidePanel
          title="Create a New Label"
          opened={this.props.opened}
          onClose={this.props.onClose}
        >
          <Main onClick={this.closeColorBox}>
            <form onSubmit={event => event.preventDefault()}>
              <PermissionField label="Label Name:">
                <LargeTextInput
                  style={{ width: '100%' }}
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
                <div onClick={this.onColorPickerClick}>
                  <TwitterPicker
                    onChangeComplete={this.onColorPickerChange}
                  />
                </div>
              }
              </PermissionField>

              <SaveButton onClick={this.onSaveClick} type="submit">Create Label</SaveButton>
            </form>
          </Main>
        </SidePanel>
      )
    }
}

const Main = styled.div`
`
const PermissionField = styled(Field)`
  margin-top: 10px;
`
const SaveButton = styled(Button)
  .attrs({ mode: 'strong', wide: true })`
  margin-top: 40px;
`
const ColorBoxPicker = styled(ColorBox)`
  cursor: pointer;
`
