import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { AragonApp, AppBar, Button, IconSettings, IconGroups, SidePanel, TextInput } from '@aragon/ui'
import { AppLayout } from './app-layout'
import { EditPanel } from './edit-panel'
import { EditMode } from '../stores/edit-mode'
import { SideBar } from './side-bar'
import { ConfigurationScreen } from './configuration-screen/configuration-screen'
import { GroupsScreen } from './groups-screen'
import Screen from './screen'
import LeftIcon from './left-icon'
import { AddPermissions } from './add-permissions'
import { DeletedFilesScreen } from './deleted-files-screen/deleted-files-screen'
import { LabelScreen } from './label-screen/label-screen'
import { FileList } from './file-list'
import { AddLabelPanel } from './add-label-panel'
import { Breadcrumb } from './breadcrumb'
import { MainDropDown } from './main-drop-down'
import { LoadingRing } from './loading-ring'
import { SearchInput } from './search-input'

const MIN_WIDTH = 800

export const App =
inject("mainStore", "configStore")(
  observer(({ mainStore, configStore }) =>
    <AragonApp publicUrl="./aragon-ui/">
      <Screen position={0} animate>
        {!configStore.isConfigSectionOpen && !mainStore.isGroupsSectionOpen && (
        <MinWidthContainer>
          <AppBar
            title="Drive"
            endContent={
              <div>
                <StyledSearchInput
                  value={mainStore.searchQuery}
                  onChange={(e) => { mainStore.searchQuery = e.target.value; mainStore.selectedFile = null; }}
                  onClearClick={() => mainStore.searchQuery = ''}
                />
                <span style={{ cursor: 'pointer' }} onClick={() => mainStore.isLabelScreenOpen = true}><LabelSectionBtn /> </span>
                <span style={{ cursor: 'pointer' }} onClick={() => mainStore.isGroupsSectionOpen = true}><GroupsSectionBtn /></span>
                <span style={{ cursor: 'pointer' }} onClick={() => mainStore.isDeletedFilesScreenOpen = true}><TrashSectionBtn /> </span>
                <span style={{ cursor: 'pointer' }} onClick={() => configStore.isConfigSectionOpen = true}><ConfigurationSectionBtn /></span>
                { mainStore.selectedFolder && mainStore.selectedFolder.permission && mainStore.selectedFolder.permissions.write && <MainDropDown mainStore={mainStore} />}
              </div>
            }
          />

          <StyledScrollWrapper>
            <AppLayout.Content>
              <Breadcrumb
                files={mainStore.selectedFolderPath}
                onFolderClick={folderId => mainStore.setSelectedFolder(folderId)}
                selectedFile={mainStore.selectedFile}
              />
              <TwoPanels>
                {mainStore.filesLoading ? (
                  <StyledLoadingRing />
                ) : (
                  <FileList
                    files={mainStore.filteredFiles}
                    selectedFile={mainStore.selectedFile}
                    onFileClick={file => mainStore.selectFile(file.id)}
                    onFileDownloadClick={file => mainStore.downloadFile(file.id)}
                    onLabelClick={label => mainStore.filterFilesWithLabel(label)}
                    onOpenClick={folder => mainStore.setSelectedFolder(folder.id)}
                  />
                )}
                <AddPermissionsPanel>
                  <SidePanel
                    title="Write Permissions"
                    opened={mainStore.isAddPermissionPanelOpen}
                    onClose={() => mainStore.isAddPermissionPanelOpen = false}
                  >
                    <AddPermissions />
                  </SidePanel>
                </AddPermissionsPanel>
                {!mainStore.filesLoading && <SideBar file={mainStore.selectedFile} /> }
              </TwoPanels>
            </AppLayout.Content>
          </StyledScrollWrapper>
          <EditPanel />
        </MinWidthContainer>
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
          <StyledScrollWrapper>
            <AppLayout.Content>
              <ConfigurationScreen />
            </AppLayout.Content>
          </StyledScrollWrapper>
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
          {mainStore.groupsLoading ? (
            <StyledLoadingRing />
          ) : (
            <GroupsScreen />
          )}
          <EditPanel />
        </span>
        )}
      </Screen>

      <AddLabelPanel
        opened={mainStore.isAddLabelPanelOpen}
        onClose={() => mainStore.isAddLabelPanelOpen = false}
      />
    </AragonApp>)
)

const StyledScrollWrapper = styled(AppLayout.ScrollWrapper)`
  height: calc(100vh - 64px);
`

const MinWidthContainer = styled.div`
  min-width: 800px;
`

const LoadingContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  height: 800px;
`

const LoadingBlock = styled.div`
    width: 100%;
`

const TwoPanels = styled.div`
  display: flex;
  width: 100%;
  min-width: 800px;
`
const StyledSearchInput = styled(SearchInput)`
  margin-right: 26px;
`
const TrashSectionBtn = styled.img.attrs({
  src: require('../images/trash.svg'),
  width: "22px",
  height: "22px"
})`
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
`
const GroupsSectionBtn = styled(IconGroups).attrs({
  width: "32px",
  height: "32px"
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
const LabelSectionBtn = styled.img.attrs({
  src: require('../images/label.svg'),
  width: "22px",
  height: "22px"
})`
  display: inline-block;
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
const StyledLoadingRing = styled(LoadingRing)`
  vertical-align: middle;
  text-align: center;
  margin: 0 auto;
`