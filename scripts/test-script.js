const {ethers} = require('hardhat')
const hre = require('hardhat')

const property = require('../.env.' + hre.network.name)

// addresses storage
let addrObj = JSON.parse(JSON.stringify(property.addr))

// constant
const MAX_UINT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

async function main() {
  console.log('-------------------------------- current network:', hre.network.name, 'id:', await ethers.provider.getNetwork(), '-------------------------------- ')
  const timestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp
  console.log('timestamp', timestamp)

  accounts = await ethers.getSigners()
  from = accounts[0].address
  const balance = await ethers.provider.getBalance(from)
  console.log('balance', ethers.utils.formatEther(balance).toString())

  acc = from

  await initContract()
  // await erc20Test()
  // await configTest()
  // await otherTest()
}

const erc20Test = async () => {
  console.log('erc20 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

  console.log('erc20 balance', (await erc20.balanceOf(acc)).toString())

}

const configTest = async () => {
  console.log('configBase >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

  // await configBase.setAuth(from, true)

  // console.log(await configBase.configNameOf(ethers.utils.toUtf8Bytes('AssetsConf')))
  // console.log(await configBase.getUint(ethers.utils.toUtf8Bytes('FishConf'), ethers.utils.toUtf8Bytes('fish_max'), 265001))
  // console.log(await configBase.getUintArray(ethers.utils.toUtf8Bytes('AdminBoxConf'), ethers.utils.toUtf8Bytes('value_ps'), 273003))
  // console.log(await configBase.getUintArray2(ethers.utils.toUtf8Bytes('AssetsConf'), ethers.utils.toUtf8Bytes('power'), 1))
  // console.log(await configBase.get(addrObj.adminBoxConfAddress, ethers.utils.toUtf8Bytes('value_ps'), 273003))
}

const otherTest = async () => {
  console.log('other >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  // const transactionReceipt = await ethers.provider.getTransactionReceipt('0xfde4fd74b4910117fe36726ae73276661c07e555684712499f1d4ff916b09ee8')
  // console.log('transactionReceipt', transactionReceipt)
  // const logs = transactionReceipt.logs
  // // console.log('race.events', race.interface)
  // const signature = ethers.utils.id('EnterRoom(address,uint256,uint256,uint256,uint256)')
  // console.log('signature', signature)
  // for (let log of logs) {
  //   if (log.topics[0] === signature) {
  //     console.log('log', log)
  //   }
  // }
}

const initContract = async () => {
  console.log('initContract >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

  if (addrObj.erc20TokenAddress) {
    erc20 = (await ethers.getContractFactory('ERC20Token')).attach(addrObj.erc20TokenAddress)
    console.log('erc20', erc20.address)
  }

  if (addrObj.configBaseAddress) {
    configBase = (await ethers.getContractFactory('ConfigBase')).attach(addrObj.configBaseAddress)
    console.log('configBase', configBase.address)
  }

  if (addrObj.assetsAddress) {
    assets = (await ethers.getContractFactory('Assets')).attach(addrObj.assetsAddress)
    console.log('assets', assets.address)
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
