import styled from 'styled-components'

export const ColorBox = styled.div(({ color, size }) => (`
    display: inline-block;
    width: ${getSize(size)}px;
    height: ${getSize(size)}px;
    border: 1px solid #ddd;
    border-radius: 4px;
    vertical-align: middle;
    background: ${color};
`))

function getSize(size) {
  switch (size) {
    case 'small': return 22;
    case 'medium': return 32;
    case 'large': return 64;
    default: return 32;
  }
}