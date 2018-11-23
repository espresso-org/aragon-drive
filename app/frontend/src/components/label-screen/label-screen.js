import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { AppBar, SidePanel, Button, Table, TableHeader, TableRow, TableCell } from '@aragon/ui'
import Screen from '../screen'
import LeftIcon from '../left-icon'
import { SideBar } from './side-bar'
import { AppLayout } from '../app-layout'
import { ActionButton } from '../action-button'
import { SelectableRow } from '../selectable-row'
import { ColorBox } from './color-box'


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
          <AppLayout.ScrollWrapper>
            <AppLayout.Content>
              <AppLayout.TwoPanels>
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
                <SideBar store={this.props.labelStore} />
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