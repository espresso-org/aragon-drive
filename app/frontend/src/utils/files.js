import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'

import * as fileDesc from './file-descriptions'

export function downloadFile(file, filename) {
  const blob = new Blob([file], { type: "application/pdf" })

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob)
    return
  }

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = data
  link.download = filename
  link.click()

  // For Firefox it is necessary to delay revoking the ObjectURL
  setTimeout(() => window.URL.revokeObjectURL(data), 100)
}

export function convertFileToArrayBuffer(file) {
  return new Promise((res) => {
    const reader = new FileReader()

    reader.onload = () => {
      res(reader.result)
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * @param {string} extension
 * @returns {string}
 */
export function getExtensionForFilename(filename) {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

/**
 * @param {string} extension
 * @returns {string}
 */
export function getClassNameForFilename(filename) {
  const fileInfo = fileDesc.extensions[getExtensionForFilename(filename).toLowerCase()]

  if (fileInfo)
    return fileInfo.className
  else
    return fileDesc.classNames.file
}

export function getDescriptionForFilename(filename) {
  const fileInfo = fileDesc.extensions[getExtensionForFilename(filename).toLowerCase()]

  if (fileInfo)
    return fileInfo.description
  else
    return ''
}

export function loadFileIcons() {
  for (const icon of fileDesc.fontAwesomeIcons)
    fontawesome.library.add(solid[icon])
}