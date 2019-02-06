import React from 'react'
import styled from 'styled-components'
import { Badge } from '@aragon/ui'
import Blockies from 'react-blockies'

const PX_RATIO = 1
const BLOCKIES_SQUARES = 8 // commonly used to represent Ethereum addresses
const BASE_SCALE = 3

export const IdentityBadge = ({ ethAddress, ...props }) =>
  <div {...props}>
    <IdentifierWrapper>
      <Identifier title={ethAddress}>
        <BlockiesScaling size={BLOCKIES_SQUARES * BASE_SCALE * PX_RATIO}>
          <Blockies
            seed={ethAddress}
            size={BLOCKIES_SQUARES}
            scale={3}
          />
        </BlockiesScaling>
        {ethAddress && `${ethAddress.substr(0, 6)}...${ethAddress.substr(ethAddress.length - 4)}`}
      </Identifier>
    </IdentifierWrapper>
  </div>

const IdentifierWrapper = styled.div`
  max-width: 100%;
`
const Identifier = styled(Badge.App)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  font-size: 15px;
  background-color: rgb(218, 234, 239);
  color: #000;
  border-radius: 3px;    
  margin-left: -9px;
  height: 24px;  
  font-weight: 300;
`

const BlockiesScaling = styled.div`
  display: inline-block;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  transform: scale(${1 / PX_RATIO}, ${1 / PX_RATIO});
  transform-origin: 0 0;
  margin-left: -9px;
  margin-right: 6px;
  vertical-align: middle;
  margin-top: -1px;
  
`