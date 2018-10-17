import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'

import { Field, TextInput, DropDown, Text } from '@aragon/ui'
import { ConfigurationRadioGrp } from '../configuration-radio-grp'
import { SaveButton } from '../large-inputs'

export const ConfigurationScreen = inject("configStore")(observer(({ configStore }) =>
  <Main>
    <Title>Storage</Title>

    <ConfigurationRadioGrp
      style={{ marginTop: '20px' }}
      options={configStore.configSelected ? [configStore.radioGrpSelectedValue] : ["ipfs", "filecoin", "swarm"]}
      store={configStore}
    />

    <ConfigurationSectionAdvancedBtn href="#" onClick={(e) => { configStore.isAdvancedConfigOpen = !configStore.isAdvancedConfigOpen; e.nativeEvent.stopImmediatePropagation(); }}>
      {configStore.isAdvancedConfigOpen ? '-' : '+'}Advanced options
    </ConfigurationSectionAdvancedBtn>

    <AdvancedOptionsContainer open={configStore.isAdvancedConfigOpen}>
      <div className="ipfsAdvancedOptions" style={{ display: configStore.radioGrpSelectedValue === "ipfs" ? 'block' : 'none' }}>
        <Field label="IPFS host:">
          <TextInput value={configStore.host} onChange={e => configStore.host = e.target.value} />
        </Field>
        <Field label="IPFS port:">
          <TextInput value={configStore.port} onChange={e => configStore.port = e.target.value} />
        </Field>
        <Field label="Protocol">
          <DropDown items={['HTTP', 'HTTPS']} active={configStore.protocolIndex} onChange={e => configStore.protocolIndex = e} />
        </Field>
      </div>
      <div className="filecoinAdvancedOptions" style={{ display: configStore.radioGrpSelectedValue === "filecoin" ? 'block' : 'none' }}>Coming soon</div>
      <div className="swarmAdvancedOptions" style={{ display: configStore.radioGrpSelectedValue === "swarm" ? 'block' : 'none' }}>Coming soon</div>
    </AdvancedOptionsContainer>

    <div>
      <Title style={{ marginTop: '50px' }}>Encryption</Title>

      <EncryptionOptionsContainer>
        <Field label="Encryption Algorithm">
          {!configStore.configSelected ?
            <DropDown
              items={configStore.encryptionAlgorithmArray}
              active={configStore.selectedEncryptionAlgorithm}
              onChange={selectedIndex => configStore.selectedEncryptionAlgorithm = selectedIndex}
            />
            :
            <TextInput value={configStore.encryptionName} disabled />
          }
        </Field>

        <Field label="Encryption key length">
          {!configStore.configSelected ?
            <DropDown
              items={configStore.encryptionKeyLengthArray}
              active={configStore.selectedEncryptionKeyLength}
              onChange={selectedIndex => configStore.selectedEncryptionKeyLength = selectedIndex}
            />
            :
            <TextInput value={configStore.keyLength} disabled />
          }
        </Field>
      </EncryptionOptionsContainer>
    </div>

    <ButtonContainer>
      <SaveButton
        style={{ width: "5%" }}
        disabled={configStore.radioGrpSelectedValue === "filecoin" || configStore.radioGrpSelectedValue === "swarm"}
        onClick={() => configStore.setSettings(configStore.host, configStore.port, configStore.protocolArray[configStore.protocolIndex], configStore.encryptionAlgorithmArray[configStore.selectedEncryptionAlgorithm], configStore.encryptionKeyLengthArray[configStore.selectedEncryptionKeyLength], configStore.selectedEncryptionAlgorithm, configStore.selectedEncryptionKeyLength)}
      >Save
      </SaveButton>
    </ButtonContainer>
  </Main>))

const Main = styled.div`
  padding-top: 30px;
  padding-left: 50px;
`
const ButtonContainer = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 8px;
`
const Title = styled(Text).attrs({ size: 'xlarge' })`
  margin-left: 16px;
  display: block;
`
const AdvancedOptionsContainer = styled.div`
  display: ${({ open }) => open ? 'block' : 'none'};
  margin-left: 50px;
`
const EncryptionOptionsContainer = styled.div`
  margin-left: 50px;
  margin-top: 10px;
`
const ConfigurationSectionAdvancedBtn = styled.a`
    font-size: small;
    &:hover ${ConfigurationSectionAdvancedBtn} {
        color: #50B6E1;
    }
    margin-left: 50px;
`