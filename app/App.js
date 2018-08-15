import React from 'react'
import Aragon, { providers } from '@aragon/client'
import { IconSettings } from '@aragon/ui'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Rodal from 'rodal'
import 'rodal/lib/rodal.css'

import { AragonApp, AppBar, Table, TableHeader, TableRow, Button } from '@aragon/ui'

import { AppLayout } from './components/app-layout'
import { EditPanel } from './components/edit-panel'
import { FileInput } from '@espresso-org/drive-components'
import { FileRow } from './components/file-row'
import { SideBar } from './components/side-bar'
import { ConfigurationRadioGrp } from './components/configuration-radio-grp'

import { mainStore } from './stores/main-store'

export default observer(() =>
  <AragonApp publicUrl="/drive/">
  
    <AppBar
      title="Drive"
      endContent={
        <div>
          <span style={{cursor: 'pointer'}} onClick={() => mainStore.isConfigSectionOpen = true}><ConfigurationSectionBtn /></span>
          <FileInput onChange={e => mainStore.uploadFiles(e.target.files)} >New File</FileInput>
        </div>
      }
    />
    <AppLayout.ScrollWrapper>
      <AppLayout.Content>
        <Breadcrumb>/</Breadcrumb>
        <TwoPanels>
          <Main>
            <Table
              header={
                <TableRow>
                  <TableHeader title="Name" />
                  <TableHeader title="Owner" />
                  <TableHeader title="Permissions" />
                  <TableHeader title="Last Modified" />
                  <TableHeader title="" />
                </TableRow>
              }
            >
              {mainStore.files.toJS().map(file => 
                file && !file.isDeleted && <FileRow
                          key={file.id}
                          file={file}
                          selected={mainStore.isFileSelected(file)}
                          onClick={() => mainStore.selectFile(file.id)}
                        />
              )}
            </Table>
          </Main>
          
          <SideBar file={mainStore.selectedFile} />
        </TwoPanels>

        <EspressoModal 
          visible={mainStore.isConfigSectionOpen} 
          onClose={() => mainStore.isConfigSectionOpen = false}  
        >
          <h1>Aragon Drive Configuration</h1>
          <ConfigurationRadioGrp />
          <div>
            <ActionButton mode="outline" emphasis="positive">Save</ActionButton>
            <ActionButton mode="outline" onClick={() => mainStore.isConfigSectionOpen = false} emphasis="negative">Cancel</ActionButton>
          </div>
        </EspressoModal>
      </AppLayout.Content>
    </AppLayout.ScrollWrapper>
    <EditPanel />
  </AragonApp>
)

const Breadcrumb = styled.div`
  font-size: 21px;
  color: #000;`

const Main = styled.div`
  width: 100%;
`
const TwoPanels = styled.div`
  display: flex;
  width: 100%;
  min-width: 800px;
`
const ConfigurationSectionBtn = styled(IconSettings).attrs({
  width: "30px",
  height: "30px"
})`
  vertical-align: middle;
  margin-right: 15px;
`
const ActionButton = styled(Button)`
  display: inline-block;
  margin: 8px 10px;
`
const EspressoModal = styled(Rodal).attrs({
  animation: 'slideDown',
  duration: 400,
  closeOnEsc: true,
  width: 800,
  height: 650,
  showCloseButton: false
})`
  text-align: center;
`
