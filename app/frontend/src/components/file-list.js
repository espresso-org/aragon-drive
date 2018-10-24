import React from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import { Table, TableRow, TableHeader } from '@aragon/ui'
import { FileRow } from './file-row'


export const FileList =
  inject("mainStore")(
    observer(({ mainStore }) =>
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
              onDownloadClick={() => mainStore.downloadFile(file.id)}
            />
          )}
        </Table>
      </Main>
    )
  )


const Main = styled.aside`
    width: 100%;
`