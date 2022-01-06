const {ethers} = require('hardhat')

const cd = require('./contract_deployment')

const property = require('../.env.' + [process.env.network])

// addresses storage
let addresses = JSON.parse(JSON.stringify(property.addr))

/**
 * deploy contract
 */
const deployContract = async () => {
    try {
        addresses.configBaseAddress = await cd.deployConfigBase(addresses)

        await cd.set(addresses)
    } catch (e) {
        console.error(e)
    } finally {
        await cd.print(addresses)
    }
}

async function main() {
    if (!process.env.deploy) {
        await deployContract()
    } else {
        await cd[process.env.deploy](addresses)
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error)
      process.exit(1)
  })
