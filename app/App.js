import React from 'react'
import Aragon, { providers } from '@aragon/client'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import { AragonApp, AppBar, Table, TableHeader, TableRow, SidePanel } from '@aragon/ui'

import { AppLayout } from './components/app-layout'
import { EditPanel } from './components/edit-panel'
import { FileInput } from './components/file-input'
import { FileRow } from './components/file-row'
import { SideBar } from './components/side-bar'

import { mainStore } from './stores/main-store'


export default observer(() =>
  <AragonApp publicUrl="/drive/">
  
    <AppBar
      title="Drive"
      endContent={
        <FileInput onChange={e => mainStore.uploadFiles(e.target.files)} >New File</FileInput>
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
                file && <FileRow
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
