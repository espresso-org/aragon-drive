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
    padding: 9px 15px 9px 15px;
    text-align: center;
    font-size: 14px;
    border-width: 1px;
    border-style: solid;
    border-radius: 3px;
    border-color: rgb(230, 230, 230);
    cursor: pointer;
    &:hover {
        border-color: #B3B3B3;
    }
    &:after {
        transition-property: all;
        transition-duration: 100ms;
        transition-timing-function: ease-in-out;
    }
`