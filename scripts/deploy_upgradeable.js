const { ethers } = require('hardhat')

const cd = require('./contract_deployment')

const property = require('../.env.' + [process.env.network])

// addresses storage
let addresses = JSON.parse(JSON.stringify(property.addr))

/**
 * deploy contract
 */
const deployContract = async () => {
  try {
    addresses.configBaseAddress = await cd.deployUpgradeable(addresses, 'ConfigBase')
    addresses.assetsAddress = await cd.deployUpgradeable(addresses, 'AssetsServer')
    addresses.erc20TokenAddress = await cd.deploy(addresses, 'ERC20Token', ['ERC20Token', 'ERC20', 18, 8_000_000_000])

    await cd.deployConf(addresses, 'XConf')

    await cd.set(addresses)

    await setContract()
  } catch (e) {
    console.error(e)
  } finally {
    await cd.print(addresses)
  }
}

const setContract = async () => {
  console.log('setContract >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

  const configBase = await cd.initContract('ConfigBase', addresses.configBaseAddress)

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
