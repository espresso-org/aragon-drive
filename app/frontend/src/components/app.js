import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import fontawesome from '@fortawesome/fontawesome'
// import solid from '@fortawesome/fontawesome-free-solid'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AragonApp, AppBar, Button, IconSettings, IconGroups, SidePanel, DropDown } from '@aragon/ui'
import { AppLayout } from './app-layout'
import { EditPanel } from './edit-panel'
import { EditMode } from '../stores/edit-mode'
import { SideBar } from './side-bar'
import { ConfigurationScreen } from './configuration-screen/configuration-screen'
import { GroupsScreen } from './groups-screen'
import Screen from './screen'
import LeftIcon from './left-icon'
import LoadingRing from './loading-ring'
import { AddPermissions } from './add-permissions'
import { DeletedFilesScreen } from './deleted-files-screen/deleted-files-screen'
import { LabelScreen } from './label-screen/label-screen'
import { FileList } from './file-list'
import { AddLabelPanel } from './add-label-panel'
import { Breadcrumb } from './breadcrumb'
import { MainDropDown } from './main-drop-down'

export const App =
inject("mainStore", "configStore")(
  observer(({ mainStore, configStore }) =>
    <AragonApp publicUrl="./aragon-ui/">
      <LoadingScreen style={{ opacity: mainStore.isLoading ? '0.4' : '1',  pointerEvents: mainStore.isLoading ? 'none' : 'auto' }}>
        <LoadingRing spin={mainStore.isLoading} style={{ visibility: mainStore.isLoading ? 'visible' : 'hidden' }} />

        <Screen position={0} animate>
          {!configStore.isConfigSectionOpen && !mainStore.isGroupsSectionOpen && (
          <div>
            <AppBar
              title="Drive"
              endContent={
                <div>
                  <span>
                    <SearchInput
                      value={mainStore.searchQuery}
                      onChange={(e) => { mainStore.searchQuery = e.target.value; mainStore.selectedFile = null; }}
                      placeholder="Search Files"
                    />
                  </span>
                  <span style={{ cursor: 'pointer' }} onClick={() => mainStore.isDeletedFilesScreenOpen = true}><TrashIco icon={faTrashAlt} /> </span>
                  <span style={{ cursor: 'pointer' }} onClick={() => mainStore.isLabelScreenOpen = true}><LabelIcon /> </span>
                  <span style={{ cursor: 'pointer' }} onClick={() => mainStore.isGroupsSectionOpen = true}><GroupsSectionBtn /></span>
                  <span style={{ cursor: 'pointer' }} onClick={() => configStore.isConfigSectionOpen = true}><ConfigurationSectionBtn /></span>
                  <MainDropDown mainStore={mainStore} />
                </div>
              }
            />

            <AppLayout.ScrollWrapper>
              <AppLayout.Content>
                <Breadcrumb
                  files={mainStore.selectedFolderPath}
                  onFolderClick={folderId => mainStore.setSelectedFolder(folderId)}
                  selectedFile={mainStore.selectedFile}
                />
                <TwoPanels>
                  <FileList
                    files={mainStore.filteredFiles}
                    selectedFile={mainStore.selectedFile}
                    onFileClick={file => mainStore.selectFile(file.id)}
                    onFileDownloadClick={file => mainStore.downloadFile(file.id)}
                    onLabelClick={label => mainStore.filterFilesWithLabel(label)}
                    onOpenClick={folder => mainStore.setSelectedFolder(folder.id)}
                  />
                  <AddPermissionsPanel>
                    <SidePanel
                      title="Add a Permission"
                      opened={mainStore.isAddPermissionPanelOpen}
                      onClose={() => mainStore.isAddPermissionPanelOpen = false}
                    >
                      <AddPermissions />
                    </SidePanel>
                  </AddPermissionsPanel>
                  <SideBar file={mainStore.selectedFile} />
                </TwoPanels>
              </AppLayout.Content>
            </AppLayout.ScrollWrapper>
            <EditPanel />
          </div>
          )}
        </Screen>

        <DeletedFilesScreen
          isVisible={mainStore.isDeletedFilesScreenOpen}
          onBackButtonClick={() => mainStore.isDeletedFilesScreenOpen = false}
        />

        <LabelScreen
          isVisible={mainStore.isLabelScreenOpen}
          onBackButtonClick={() => mainStore.isLabelScreenOpen = false}
        />

        <Screen position={1} animate>
          {configStore.isConfigSectionOpen && (
          <span>
            <AppBar>
              <BackButton onClick={() => { configStore.isConfigSectionOpen = false; configStore.isAdvancedConfigOpen = false; }} style={{ display: configStore.configSelected ? 'flex' : 'none' }}>
                <LeftIcon />
              </BackButton>
              <h1 style={{ lineHeight: 1.5, fontSize: "22px" }}>Settings</h1>
            </AppBar>
            <ConfigurationScreen />
          </span>
          )}
        </Screen>

        <Screen position={1} animate>
          {mainStore.isGroupsSectionOpen && (
          <span>
            <AppBar endContent={<Button mode="strong" onClick={() => mainStore.setEditMode(EditMode.GroupCreate)}>New Group</Button>}>
              <BackButton onClick={() => { mainStore.isGroupsSectionOpen = false; mainStore.selectedGroup = null; }}>
                <LeftIcon />
              </BackButton>
              <h1 style={{ lineHeight: 1.5, fontSize: "22px" }}>Groups</h1>
            </AppBar>
            <GroupsScreen />
            <EditPanel />
          </span>
          )}
        </Screen>

        <AddLabelPanel
          opened={mainStore.isAddLabelPanelOpen}
          onClose={() => mainStore.isAddLabelPanelOpen = false}
        />
      </LoadingScreen>
    </AragonApp>)
)

const TrashIco = styled(FontAwesomeIcon)`
  width: auto !important;
  height: 22px;
  fill-opacity: 0.8;
  vertical-align: middle;
  margin: 0 14px;
`
const LoadingScreen = styled.div`
  min-height:100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const TwoPanels = styled.div`
  display: flex;
  width: 100%;
  min-width: 800px;
`
const GroupsSectionBtn = styled(IconGroups).attrs({
  width: "30px",
  height: "30px"
})`
  vertical-align: middle;
  margin-right: 15px;
`
const ConfigurationSectionBtn = styled(IconSettings).attrs({
  width: "30px",
  height: "30px"
})`
  vertical-align: middle;
  margin-right: 15px;
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
const AddPermissionsPanel = styled.div`
  > * {
    z-index: 4 !important;
  }
`
const LabelIcon = styled.img.attrs({ src: require('../images/labels-icon.png') })`
  display: inline-block;
  width: 24px;
  vertical-align: middle;
  margin-right: 10px;
`
const SearchInput = styled.input`
  border: 0;
  outline: 0;
  border-bottom: 1px solid black;
  margin-right: 15px;
  width: 150px;
  font-size: 13px;
  background-image: url(${require("../../../css/img/search-icon.png")});
  background-repeat: no-repeat;
  background-size: 22px;
  background-position: left center;
  padding-left: 30px;

  ::-webkit-input-placeholder {
    font-size: 13px;
  }
  ::-moz-placeholder {
    font-size: 13px;   
  }
  :-ms-input-placeholder {
    font-size: 13px;   
  }
  :-moz-placeholder {
    font-size: 13px;   
  }
`