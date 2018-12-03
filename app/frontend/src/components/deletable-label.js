import React from 'react'
import styled from 'styled-components'


export const DeletableLabel = ({ label, onDeleteClick, ...props }) =>
  <Main {...props} color={`#${label.color}`}>
    {label.name}
    <Delete onClick={() => onDeleteClick && onDeleteClick(label)}>
      <svg width={10} height={10} style={{ transform: 'scale(0.8)', verticalAlign: 'middle' }}>
        <path
          d="M10 1.014L6.014 5 10 8.986 8.986 10 5 6.014 1.014 10 0 8.986 3.986 5 0 1.014 1.014 0 5 3.986 8.986 0z"
          fill="#6D777B"
          fillRule="evenodd"
          opacity={0.8}
        />
      </svg>
    </Delete>
  </Main>


const Main = styled.div(({ color }) => (`
  display: inline-block;
  height: 28px;
  font-size: 14px;
  color: #000;  
  background-color: ${color};
  padding: 0 10px;
  margin: 0 5px;
  border-radius: 4px;
  padding-top: 1px;
  letter-spacing: 0.5px;
`))

const Delete = styled.div`
  display: inline-block;
  cursor: pointer;
  text-align: center;
  width: 20px;
  height: 100%;
  vertical-align: middle;  
  margin-left: 8px;
  padding-top: 2px;
`

// text-shadow: 1px 0 0px rgba(0,0,0,0.6), -1px 0 0px rgba(0,0,0,0.6), 0px 1px 0px rgba(0,0,0,0.6), 0px -1px 0px rgba(0,0,0,0.6);