export * from './file-descriptions'
export * from './files'

export function validateEthAddress(address) {
    return address && new RegExp('0[xX][0-9a-fA-F]+').test(address)
}