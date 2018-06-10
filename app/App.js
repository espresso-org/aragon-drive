import React from 'react'
import {
  AragonApp,
  Button,
  Text,

  observe
} from '@aragon/ui'
import Aragon, { providers } from '@aragon/client'
import styled from 'styled-components'

const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default class App extends React.Component {

  state = { files: []}

  async componentDidMount() {
    setTimeout(async () => {      
      const files = await window.dataStore.listFiles()
      this.setState({ files })
    }, 10000)
  }

  uploadFiles = async e => {
    const files = e.target.files

    for (let file of files) {      
      const result = await convertFileToArrayBuffer(file)      
      await window.dataStore.addFile(file.name, result)        
    }  

  }

  fileClick = async fileId => {
    const file = await window.dataStore.getFile(fileId)
    downloadFile(file.content, file.name)
  }

  render () {
    return (
      <AppContainer>
        <div>
          <input type="file" id="myFile" multiple size="50" onChange={this.uploadFiles} />

          {this.state.files.map(file =>
            <div onClick={() => this.fileClick(file.id)} key={file.id}>{file.id}: {file.name}</div>
          )}

          <ObservedCount observable={this.props.observable} />
          <Button onClick={() => this.props.app.decrement(1)}>Decrement</Button>
          <Button onClick={() => this.props.app.increment(1)}>Increment</Button>
        </div>
      </AppContainer>
    )
  }
}

const ObservedCount = observe(
  (state$) => state$,
  { count: 0 }
)(
  ({ count }) => <Text.Block style={{ textAlign: 'center' }} size='xxlarge'>{count}</Text.Block>
)

function downloadFile(file, filename) {
  var blob = new Blob([file], {type: "application/pdf"})

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob)
    return
  } 

  // For other browsers: 
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(blob)
  var link = document.createElement('a')
  link.href = data
  link.download=filename
  link.click()

  // For Firefox it is necessary to delay revoking the ObjectURL
  setTimeout(() => window.URL.revokeObjectURL(data), 100)  

}


function convertFileToArrayBuffer(file) {
  return new Promise((res, rej) => {

    let reader = new FileReader()

    reader.onload = function (e) {
      res(reader.result)
    }

    reader.readAsArrayBuffer(file)
  })
}