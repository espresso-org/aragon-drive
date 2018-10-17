import React from 'react'
import styled from 'styled-components'

export const FileInput = ({ children, onChange, ...props }) =>
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
    display: inline-block;
    position: relative;
    padding: 10px 15px;
    white-space: nowrap;
    line-height: 1.5;
    font-size: 14px;
    font-weight: 600;
    color: #707070;
    background: #FFFFFF;
    border: 0;
    border-radius: 3px;
    outline: 0;
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    position: relative;
    overflow: hidden;
    box-shadow: 0 1px 1px rgba(0,0,0,0);
    color: #FFFFFF;
    vertical-align: middle;
    background-color: transparent;
    background-image: linear-gradient( 130deg,#00B4E6,#00F0E0 );
    transition: all 100ms ease-in-out;
    &:hover {
      box-shadow: 0 1px 1px rgba(0,0,0,0.2);
    }
`
