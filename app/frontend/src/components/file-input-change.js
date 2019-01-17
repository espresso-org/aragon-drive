import React from 'react'
import styled from 'styled-components'

export const FileInputChange = ({ children, onChange, ...props }) =>
  <Container {...props}>
    <HiddenInput {...{ onChange }} />
    {children}
  </Container>

const HiddenInput = styled.input.attrs({ type: 'file' })`
  width: 0;
  height: 0;
  z-index: -1;
  overflow: hidden;
  position: absolute;
`
const Container = styled.label`
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    display: block;
    width: 100%;
    background-color: white;
    color: rgb(112, 112, 112);
    margin: 8px 0px;
    border-color: rgb(230, 230, 230);
    &:hover {
        border-color: rgb(112, 112, 112);
    }
    &:after {
        transition-property: all;
        transition-duration: 100ms;
        transition-timing-function: ease-in-out;
    }
`