import React from 'react'
import styled from 'styled-components'
import { theme } from '@aragon/ui'

const LoadingRing = ({ spin, ...props }) => (
  <Main spin={spin} {...props}>
    <Ring spin={spin} />
  </Main>
)

const Main = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  animation: ${({ spin }) => (spin ? 'spin 1s infinite linear' : 'none')};
`
const Ring = styled.span`
  position: relative;
  overflow: ${({ spin }) => (spin ? 'hidden' : 'visible')};
  width: 102px;
  height: 100%;
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 143px;
    height: 143px;
    border-radius: 50%;
    border: 1px solid ${theme.accent};
  }
`

export default LoadingRing