import React from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

export const SearchInput =
    inject("mainStore")(
      observer(({ value, onChange, onClearClick, ...props }) =>
        <Main {...props}>
          <StyledInput placeholder="Search Files" value={value} onChange={onChange} />
          { value &&
            <InsideButton onClick={onClearClick} src={require('../images/close.svg')} alt="X" />
          }
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
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  padding: 5px 10px;
  background: #FFFFFF;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.06);
  outline: 0;
  width: 180px;
  font-size: 13px;

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
const InsideButton = styled.img`
  height: 10px;
  width: 10px;
  position: absolute;
  right: 12px;
  top: 10px;
  cursor: pointer;
`