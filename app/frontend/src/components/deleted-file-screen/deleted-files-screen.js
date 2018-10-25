import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { AppBar, SidePanel } from '@aragon/ui'
import { FileList } from './file-list'
import { Screen } from './screen'
import { AppLayout } from './app-layout'



@inject("mainStore")
@observer
export class DeletedFilesScreen extends Component {


  render() {
    return (
        <Screen position={1} animate>
        {mainStore.isTrashOpen && (
        <span>
          <AppBar>
            <BackButton onClick={() => { this.props.mainStore.isConfigSectionOpen = false; }}>
              <LeftIcon />
            </BackButton>
            <h1 style={{ lineHeight: 1.5, fontSize: "22px" }}>Deleted Files</h1>
          </AppBar>
          <AppLayout.ScrollWrapper>
            <AppLayout.Content>
              <AppLayout.TwoPanels>
                <FileList
                  files={this.props.mainStore.files}
                  file={this.props.mainStore.selectedFile}
                  selectedFile={this.props.mainStore.selectedFile}
                  onFileClick={file => this.props.mainStore.selectFile(file.id)}
                  onFileDownloadClick={file => this.props.mainStore.downloadFile(file.id)}
                />
                <SideBar />
              </AppLayout.TwoPanels>
            </AppLayout.Content>
          </AppLayout.ScrollWrapper>
        </span>
        )}
      </Screen>
    )
  }
}

const Main = styled.div` 
`

const BackButton = styled.span`
  display: flex;
  align-items: center;
  height: 63px;
  margin: 0 30px 0 -30px;
  cursor: pointer;
  svg path {
    stroke: hsl(179, 76%, 48%);
  }
  :active svg path {
    stroke: hsl(179, 76%, 63%);
  }
`