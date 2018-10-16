import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { ImageCheckbox } from './image-checkbox'

import ipfs from './configuration-screen/img/ipfs-logo.svg'
import filecoin from './configuration-screen/img/filecoin-logo.svg'
import swarm from './configuration-screen/img/swarm-logo.png'

const logos = { ipfs, filecoin, swarm }

// TODO: Move component to its own folder and move images in it
export const ConfigurationRadioGrp = observer(({ options, store, ...props }) =>
  <Main {...props}>
    {options.map((option, i) =>

      <ImageCheckbox
        key={i}
        active={store.radioGrpSelectedIndex === i}
        template={option}
        icon={logos[option]}
        label={option}
        onSelect={() => { store.radioGrpSelectedIndex = i; store.radioGrpSelectedValue = options[i]; }}
      />)}
  </Main>)

const Main = styled.div`
    padding-left: 32px;
`