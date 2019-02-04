import React from 'react'
import styled from 'styled-components'
import { theme } from '@aragon/ui'

const RING_RATIO1 = 102 / 200
const RING_RATIO2 = 143 / 200

export const LoadingRing = ({ spin = true, size = 200, ...props }) => (
  <Main spin={spin} size={size} {...props}>
    <Ring spin={spin} size={size} />
  </Main>
)

const Main = styled.span(({ spin, size }) => `
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${size}px;
  height: ${size}px;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  animation: ${spin ? 'spin 1s infinite linear' : 'none'};
`)
const Ring = styled.span(({ spin, size }) => `
  position: relative;
  overflow: ${spin ? 'hidden' : 'visible'};
  width: ${RING_RATIO1 * size}px;
  height: 100%;
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${RING_RATIO2 * size}px;
    height: ${RING_RATIO2 * size}px;
    border-radius: 50%;
    border: 1px solid ${theme.accent};
  }
`)