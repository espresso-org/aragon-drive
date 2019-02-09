import React from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

export const SearchInput =
    inject("mainStore")(
        observer(({ value, onChange, onClick }) =>
            <Main>
                <StyledInput placeholder="Search Files" value={value} onChange={onChange} />
                <InsideButton onClick={onClick}><img src={require('../images/close.svg')} alt="X" /></InsideButton>
            </Main>
        )
    )

const Main = styled.div`
  position: relative;
  display: inline-block;
`
const StyledInput = styled.input`
  padding-left: 10px;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 3px;
  color: #000000;
  font-weight: 400;
  line-height: 1.5;
  padding: 5px 10px;
  background: #FFFFFF;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.06);
  outline: 0;
  width: 150px;
  font-size: 13px;
  background-repeat: no-repeat;

  ::-webkit-input-placeholder {
    font-size: 13px;
  }
  ::-moz-placeholder {
    font-size: 13px;   
  }
  :-ms-input-placeholder {
    font-size: 13px;   
  }
  :-moz-placeholder {
    font-size: 13px;   
  }
`
const InsideButton = styled.button`
  height: 20px;
  width: 20px;
  position: relative;
  right: 30px;
  border: none;
  border-radius: 100%;
  outline: none;
  text-align: center;
  font-weight: bold;

  &:hover {
    cursor: pointer;
  }
`