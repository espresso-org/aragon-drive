import styled from 'styled-components'
import React, { Component } from 'react'
import { DropDown } from '@aragon/ui'


const arrow = `<svg width='9' height='5' viewBox='0 0 9 5' xmlns='http://www.w3.org/2000/svg'><path d='M0 0h8.36L4.18 4.18z' fill='#ffffff' fill-rule='evenodd'/></svg>`


export class MainDropDown extends Component {
  constructor(props) {
    super(props)

    this.items = [
      <FileInput id="main-file-input">New File</FileInput>,
      'New Folder',
    ]

    // Ugly fix so we don't have "New" in the dropdown item list
    this.items[-1] = 'New'
  }

  handleChange = (index) => {
    if (index === 0) {
      // refs don't seem to work with components outside the render function
      document.getElementById('main-file-input').click()
    } else if (index === 1)
      console.log('folder click')
  }


  render() {
    return (
      <Main>
        <DropDown
          {...this.props}
          items={this.items}
          active={-1}
          onChange={this.handleChange}
        />
      </Main>
    )
  }
}

// Aragon DropDown components can't be inherited with the usual
// styled(DropDown), so we use css child selectors to change the style
const Main = styled.div`
    display: inline-block;
    
    > div > div:first-of-type {
        color: white;
        background-image: url("data:image/svg+xml;utf8,${arrow}"), linear-gradient( 130deg,#00B4E6,#00F0E0 );
        background-position: calc(100% - 15px) 50%, 0 0;
    }

    > div > div:first-of-type:hover {
        color: white;
    }
`

const FileInput = ({ children, onChange, ...props }) =>
  <FileInputContainer {...props}>
    <HiddenInput {...{ onChange }} />
    {children}
  </FileInputContainer>

const HiddenInput = styled.input.attrs({ type: 'file' })`
  width: 0;
  height: 0;
  z-index: -1;
  overflow: hidden;
  position: absolute;
`
const FileInputContainer = styled.label`
    display: inline-block;
    position: relative;
`
