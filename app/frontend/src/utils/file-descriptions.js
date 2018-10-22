export const classNames = {
  image: 'file-image',
  pdf: 'file-pdf',
  word: 'file-word',
  powerpoint: 'file-powerpoint',
  excel: 'file-excel',
  audio: 'file-audio',
  video: 'file-video',
  zip: 'file-archive',
  code: 'file-code',
  text: 'file-alt',
  file: 'file'
}

export const extensions = {
  gif: {
    className: classNames.image,
    description: 'Image'
  },
  jpeg: {
    className: classNames.image,
    description: 'Image'
  },
  jpg: {
    className: classNames.image,
    description: 'Image'
  },
  png: {
    className: classNames.image,
    description: 'Image'
  },
  svg: {
    className: classNames.image,
    description: 'Vector Image'
  },

  pdf: {
    className: classNames.pdf,
    description: 'PDF document'
  },

  doc: {
    className: classNames.word,
    description: 'MS Word'
  },
  docx: {
    className: classNames.word,
    description: 'MS Word'
  },

  ppt: {
    className: classNames.powerpoint,
    description: 'MS Powerpoint'
  },
  pptx: {
    className: classNames.powerpoint,
    description: 'MS Powerpoint'
  },

  xls: {
    className: classNames.excel,
    description: 'MS Excel'
  },
  xlsx: {
    className: classNames.excel,
    description: 'MS Excel'
  },

  aac: {
    className: classNames.audio,
    description: 'Audio file'
  },
  mp3: {
    className: classNames.audio,
    description: 'Audio file'
  },
  ogg: {
    className: classNames.audio,
    description: 'Audio file'
  },

  avi: {
    className: classNames.video,
    description: 'Video'
  },
  flv: {
    className: classNames.video,
    description: 'Video'
  },
  mkv: {
    className: classNames.video,
    description: 'Video'
  },
  mp4: {
    className: classNames.video,
    description: 'Video'
  },

  gz: {
    className: classNames.zip,
    description: 'Archive'
  },
  zip: {
    className: classNames.zip,
    description: 'Archive'
  },

  css: {
    className: classNames.code,
    description: 'CSS file'
  },
  html: {
    className: classNames.code,
    description: 'HTML file'
  },
  js: {
    className: classNames.code,
    description: 'Javascript file'
  },
  jsx: {
    className: classNames.code,
    description: 'JSX File'
  },
  sol: {
    className: classNames.code,
    description: 'Solidity'
  },

  txt: {
    className: classNames.text,
    description: 'Text file'
  },

  file: {
    className: classNames.file,
    description: ''
  }
}

export const fontAwesomeIcons = [
  'faFileImage',
  'faFilePdf',
  'faFileWord',
  'faFilePowerpoint',
  'faFileExcel',
  'faFileAudio',
  'faFileVideo',
  'faFileArchive',
  'faFileCode',
  'faFileAlt',
  'faFile',
]