import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { AppBar, SidePanel, Button, Table, TableHeader, TableRow, TableCell } from '@aragon/ui'
import { FileList } from '../file-list'
import Screen from '../screen'
import LeftIcon from '../left-icon'
import { SideBar } from './side-bar'
import { AppLayout } from '../app-layout'
import { ActionButton } from '../action-button'
import { SelectableRow } from '../selectable-row'


@inject("mainStore", "labelStore")
@observer
export class LabelScreen extends Component {
  constructor(props) {
    super(props)
  }


  render() {
    return (
      <Screen position={1} animate>
        {this.props.isVisible && (
        <Main>
          <AppBar
            endContent={
              <Button mode="strong">New Label</Button>
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
                  {this.props.labelStore.availabelLabels.map(label =>
                    <SelectableRow>
                      <TableCell>{label.name}</TableCell>
                      <TableCell>{label.color}</TableCell>
                    </SelectableRow>
                  )}
                </Table>
                {/* <SideBar store={this.store} /> */}
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