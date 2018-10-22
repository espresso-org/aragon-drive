#!/usr/bin/env node

/**
 * Returns the bytecode size of a contract
 */


function main (name) {
    if (!name) {
        console.log('Error: Please submit a valid contract name')
        return
    }

    const contract = require(`../build/contracts/${name}.json`)
    var deployedSize = (contract.deployedBytecode.length / 2) - 1
    console.log(deployedSize)
}

main(process.argv[2])
