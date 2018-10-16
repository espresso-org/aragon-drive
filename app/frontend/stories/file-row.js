import React from "react"
import { Table, TableHeader, TableRow } from '@aragon/ui'
import { BigNumber } from 'bignumber.js'
import { aragonStoriesOf } from '../src/utils/aragon-stories-of'
import { FileRow } from "../src/components/file-row"

aragonStoriesOf("FileRow", module).add("Read Write Jpg", () => {
  const file = {
    name: 'file-name.jpg',
    owner: '0x2284dd7330abade7fa8951414fcf7d17be35f69b',
    lastModification: new BigNumber(1534519442),
    permissions: {
      read: true,
      write: true
    }
  }

  return (
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
      <FileRow
        file={file}
        selected={false}
        onClick={console.log}
        onDownloadClick={console.log}
      />
    </Table>
  )
})
