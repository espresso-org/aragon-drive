import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { AppBar, SidePanel } from '@aragon/ui'
import { FileList } from '../file-list'
import Screen from '../screen'
import LeftIcon from '../left-icon'
import { SideBar } from './side-bar'
import { AppLayout } from '../app-layout'
import { DeletedFilesStore } from './deleted-files-store'
import { ActionButton } from '../action-button'


@inject("mainStore")
@observer
export class LabelScreen extends Component {
  constructor(props) {
    super(props)

    this.store = new DeletedFilesStore(props.mainStore)
    window.dstore = this.store
  }


  render() {
    return (
      <Screen position={1} animate>
        {this.props.isVisible && (
        <Main>
          <AppBar
            endContent={
              <EmptyButton
                mode="outline"
                onClick={() => this.store.deleteFilesPermanently()}
                emphasis="negative"
              >
                  Empty Files
              </EmptyButton>
           }
          >
            <BackButton onClick={() => this.props.onBackButtonClick && this.props.onBackButtonClick()}>
              <LeftIcon />
            </BackButton>
            <AppBarTitle>Deleted Files</AppBarTitle>

          </AppBar>
          <AppLayout.ScrollWrapper>
            <AppLayout.Content>
              <AppLayout.TwoPanels>
                <FileList
                  files={this.store.files}
                  selectedFile={this.store.selectedFile}
                  onFileClick={file => this.store.selectFile(file)}
                  onFileDownloadClick={file => this.store.downloadFile(file.id)}
                />
                <SideBar store={this.store} />
              </AppLayout.TwoPanels>
            </AppLayout.Content>
          </AppLayout.ScrollWrapper>
        </Main>
        )}
      </Screen>
    )
  }
}

const Main = styled.div` 
    height: 100%;
    background-color: #f7fbfd;
`

const EmptyButton = styled(ActionButton)`
  width: 180px;
`

const AppBarTitle = styled.h1`
  line-height: 1.5; 
  font-size: 22px;
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