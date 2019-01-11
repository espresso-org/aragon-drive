import React from 'react'
import styled from 'styled-components'

export const Label = ({ label, ...props }) =>
  <Main {...props} color={`#${label.color}`}>
    {label.name}
  </Main>

const Main = styled.div(({ color }) => (`
  display: inline-block;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  color: #000;  
  background-color: ${color};
  padding: 0 10px;
  margin: 0 5px;
  border-radius: 4px;
  padding-top: 1px;
  letter-spacing: 0.5px;
`))
// text-shadow: 1px 0 0px rgba(0,0,0,0.6), -1px 0 0px rgba(0,0,0,0.6), 0px 1px 0px rgba(0,0,0,0.6), 0px -1px 0px rgba(0,0,0,0.6);