const {ethers} = require('hardhat')
const hre = require('hardhat')

const { sleep, processNonce, erc20BalanceOf, erc20Approve, nftApprove, toWei, toEther, decodeFunction } = require('./contractUtil')

const property = require('../.env.' + hre.network.name)
const cd = require('./contract_deployment')

//  storage
let addresses = JSON.parse(JSON.stringify(property.addr))

// constant
const MAX_UINT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

async function main() {
  console.log('-------------------------------- current network:', hre.network.name, 'id:', await ethers.provider.getNetwork(), '-------------------------------- ')
  blockTag = await ethers.provider.getBlockNumber()
  timestamp = (await ethers.provider.getBlock(blockTag)).timestamp
  console.log('timestamp', timestamp)

  accounts = await ethers.getSigners()
  connetWallet = accounts[0]
  // connetWallet = new ethers.Wallet('', ethers.provider)
  from = connetWallet.address
  console.log('from', from)
  const balance = await ethers.provider.getBalance(from)
  console.log('balance', ethers.utils.formatEther(balance).toString())

  acc = from

  await initContract()
  // await xxxTest()
  // await erc20Test()
  // await configTest()
}

const xxxTest = async () => {
  console.log('xxx >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  const xxx = await cd.initContract('xxx', addresses.xxxAddress)

  ///////////////////////////////// call /////////////////////////////////

  ///////////////////////////////// sendTx /////////////////////////////////

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
  // console.log(await configBase.get(addresses.adminBoxConfAddress, ethers.utils.toUtf8Bytes('value_ps'), 273003))
}

const initContract = async () => {
  console.log('initContract >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

  if (addresses.erc20TokenAddress) {
    erc20 = (await ethers.getContractFactory('ERC20Token')).attach(addresses.erc20TokenAddress).connect(connetWallet)
    console.log('erc20', erc20.address)
  }

  if (addresses.configBaseAddress) {
    configBase = (await ethers.getContractFactory('ConfigBase')).attach(addresses.configBaseAddress).connect(connetWallet)
    console.log('configBase', configBase.address)
  }

  if (addresses.assetsAddress) {
    assets = (await ethers.getContractFactory('Assets')).attach(addresses.assetsAddress).connect(connetWallet)
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
