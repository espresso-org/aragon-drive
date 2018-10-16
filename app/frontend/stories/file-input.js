import React from "react"
import { aragonStoriesOf } from '../src/utils/aragon-stories-of'
import { FileInput } from "../src/components/file-input"

aragonStoriesOf("FileInput", module).add("Basic", () => (
  <FileInput onChange={e => console.log(e.target.files)}>Upload File</FileInput>
))
