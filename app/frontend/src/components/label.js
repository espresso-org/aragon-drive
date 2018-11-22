import React from 'react'
import styled from 'styled-components'


export const Label = ({ label, ...props }) =>
  <Main {...props} color={`#${label.color}`}>
    {label.name}
  </Main>


const Main = styled.div(({ color }) => (`
    display: inline-block;
    height: 26px;
    line-height: 26px;
    font-size: 16px;
    color: white;
    text-shadow: 1px 0 2px 6px rgba(0,0,0,0.4);
    background-color: ${color};
    padding: auto 8px;
`))