import styled from 'styled-components'

export const ColorBox = styled.div`
    display: inline-block;
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: ${({ color }) => color};
`