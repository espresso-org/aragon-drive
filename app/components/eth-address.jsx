import React, { Component } from 'react'

export class EthAddress extends Component {
  constructor(props) {
    super(props)
  }

  formatEthAddress(address) {
    if(address != null)
        return address.substr(0, 6) + "..." + address.substr(address.length - 4)
  }

  render() {
    return (
        <div>
            {this.formatEthAddress(this.props.ethAddress)}
        </div>
    )
  }
}