import React from 'react'
import styled from 'styled-components'
import { Badge } from '@aragon/ui'

export const EthAddress = ({ ethAddress, ...props }) =>
  <div {...props}>
    <IdentifierWrapper>
      <Identifier title={ethAddress}>{ethAddress && `${ethAddress.substr(0, 6)}...${ethAddress.substr(ethAddress.length - 4)}`}</Identifier>
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
  margin-left: -9px;
`