import React from 'react'

export const EthAddress = ({ ethAddress }) => 
  <div>
    {ethAddress && `${ethAddress.substr(0, 6)}...${ethAddress.substr(ethAddress.length - 4)}`}
  </div>