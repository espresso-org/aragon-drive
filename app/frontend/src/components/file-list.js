import React from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import { Table, TableRow, TableHeader } from '@aragon/ui'
import { FileRow } from './file-row'

export const FileList =
  inject("mainStore")(
    observer(({ files, selectedFile, onFileClick, onLabelClick, onFileDownloadClick, onOpenClick }) =>
      <Main>
        <Table
          header={
            <TableRow>
              <TableHeader title="Name" />
              <TableHeader title="Owner" />
              <TableHeader title="Permission" />
              <TableHeader title="Last Modified" />
              <TableHeader title="" />
            </TableRow>
        }
        >
          {files.map(file =>
            <FileRow
              key={file.id}
              file={file}
              selected={selectedFile && selectedFile.id === file.id}
              onClick={() => onFileClick && onFileClick(file)}
              onDownloadClick={() => onFileDownloadClick(file)}
              onOpenClick={() => onOpenClick(file)}
              onLabelClick={onLabelClick}
            />
          )}
        </Table>
      </Main>
    )
  )

const Main = styled.aside`
    width: 100%;
`