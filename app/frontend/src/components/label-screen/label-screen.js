import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { AppBar, Button, Table, TableHeader, TableRow, TableCell } from '@aragon/ui'
import Screen from '../screen'
import LeftIcon from '../left-icon'
import { SideBar } from './side-bar'
import { AppLayout } from '../app-layout'
import { ActionButton } from '../action-button'
import { SelectableRow } from '../selectable-row'
import { ColorBox } from './color-box'
import { LoadingRing } from '../loading-ring'

@inject("mainStore", "labelStore")
@observer
export class LabelScreen extends Component {
  constructor(props) {
    super(props)

    window.labelStore = props.labelStore
  }

  render() {
    return (
      <Screen position={1} animate>
        {this.props.isVisible && (
        <Main>
          <AppBar
            endContent={
              <Button mode="strong" onClick={() => this.props.mainStore.isAddLabelPanelOpen = true}>New Label</Button>
           }
          >
            <BackButton onClick={() => this.props.onBackButtonClick && this.props.onBackButtonClick()}>
              <LeftIcon />
            </BackButton>
            <AppBarTitle>Labels</AppBarTitle>

          </AppBar>
          {this.props.labelStore.labelsLoading ? (
            <StyledLoadingRing />
          ) : (
            <AppLayout.ScrollWrapper>
              <AppLayout.Content>
                <AppLayout.TwoPanels>
                  <TableContainer>
                    <Table
                      header={
                        <TableRow>
                          <TableHeader title="Name" />
                          <TableHeader title="Color" />
                        </TableRow>
                          }
                    >
                      {this.props.labelStore.availableLabels.map(label =>
                        <SelectableRow
                          selected={this.props.labelStore.isLabelSelected(label)}
                          onClick={() => this.props.labelStore.selectLabel(label)}
                        >
                          <TableCell>{label.name}</TableCell>
                          <TableCell>
                            <ColorBox
                              color={`#${label.color}`}
                              style={{ position: 'absolute ' }}
                            />
                          </TableCell>
                        </SelectableRow>
                      )}
                    </Table>
                  </TableContainer>
                  <SideBar store={this.props.labelStore} />
                </AppLayout.TwoPanels>
              </AppLayout.Content>
            </AppLayout.ScrollWrapper>
          )}
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
const LoadingContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  height: 800px;
`

const LoadingBlock = styled.div`
    width: 100%;
`

const TableContainer = styled.aside`
    width: 100%;
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
const StyledLoadingRing = styled(LoadingRing)`
  vertical-align: middle;
  text-align: center;
  margin: 0 auto;
`