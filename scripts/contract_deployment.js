const { ethers, upgrades } = require('hardhat')

module.exports.print = async (addresses) => {
  let arr = []
  for (const key in addresses) {
    arr.push(key)
  }
  arr.sort()

  for (const i in arr) {
    console.log(arr[i] + ': \'' + addresses[arr[i]] + '\',')
  }
}

module.exports.deploy = async (addresses, contractName, args = []) => {
  console.log('deploy >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', contractName)
  const contractFactory = await ethers.getContractFactory(contractName)
  const contract = await contractFactory.deploy(...args)
  console.log('contractAddress:', contract.address)

  return contract.address
}

module.exports.deployUpgradeable = async (addresses, contractName, args = [], opts = {}) => {
  console.log('deployUpgradeable >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', contractName)
  const contractFactory = await ethers.getContractFactory(contractName)
  const contract = await upgrades.deployProxy(contractFactory, args, opts)
  await contract.deployed()
  console.log('contractAddress:', contract.address)

  return contract.address
}

module.exports.deployConf = async (addresses, contractName) => {
  console.log('deployConf >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', contractName)
  const contractFactory = await ethers.getContractFactory(contractName)
  const contract = await contractFactory.deploy()
  console.log('contractAddress:', contract.address)

  console.log('configBase.setConfigNameOf ---------------------------------')
  const configBase = (await ethers.getContractFactory('ConfigBase')).attach(addresses.configBaseAddress)
  await configBase.setConfigNameOf(ethers.utils.toUtf8Bytes(contractName), contract.address)

  return contract.address
}

module.exports.upgrade = async (contractName, contractAddress) => {
  console.log('upgrade >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', contractName)
  const contractFactory = await ethers.getContractFactory(contractName)
  const contract = await upgrades.upgradeProxy(contractAddress, contractFactory, {})
  console.log('upgrade:', contract.address)
}

module.exports.forceImport = async (contractName, contractAddress) => {
  console.log('forceImport >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', contractName)
  const contractFactory = await ethers.getContractFactory(contractName)
  const contract = await upgrades.forceImport(contractAddress, contractFactory, {})
  console.log('forceImport:', contract.address)
}

module.exports.initContract = async (contractName, contractAddress, signer) => {
  if (contractAddress) {
    // const contract = (await ethers.getContractFactory(contractName)).attach(contractAddress)
    let contract = await ethers.getContractAt(contractName, contractAddress)
    if (signer) {
      contract = contract.connect(signer)
    }
    console.log(contractName, contract.address)

    return contract
  }
}

module.exports.set = async (addresses) => {
  console.log('setConfigNameOf >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

  const configBase = (await ethers.getContractFactory('ConfigBase')).attach(addresses.configBaseAddress)
  const ca = async (contractName, contractAddress) => {
    const configAddress = await configBase.configNameOf(ethers.utils.toUtf8Bytes(contractName))
    console.log(contractName, configAddress, configAddress === contractAddress)
    if (
      contractAddress
      && configAddress !== contractAddress
      && contractAddress !== '0x0000000000000000000000000000000000000000'
    ) {
      console.log('setConfigNameOf ---------------------------------', contractName, contractAddress)
      await configBase.setConfigNameOf(ethers.utils.toUtf8Bytes(contractName), contractAddress)
    }
  }

  await ca('Assets', addresses.assetsAddress)

  console.log('setConfig >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

  const setConfig = async (contractName, contractAddress, configAddress) => {
    if (!contractAddress) {return}
    const contract = (await ethers.getContractFactory(contractName)).attach(contractAddress)
    const config = await contract.config()
    console.log(contractName, config)
    if (configAddress && !config) {
      console.log('setConfig -------------------------------- ', contractName, configAddress)
      await contract.setConfig(configAddress)
    }
  }

  await setConfig('AssetsServer', addresses.assetsAddress,
    addresses.configBaseAddress)

  console.log('setAuth >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

  const setAuth = async (contractName, contractAddress, des) => {
    if (!contractAddress || !des) {return}
    const contract = (await ethers.getContractFactory(contractName)).attach(contractAddress)
    const auth = await contract.auth(des)
    console.log(contractName, des, auth)
    if (des && !auth) {
      console.log('setAuth ---------------------------------', contractName, des)
      await contract.setAuth(des, true)
    }
  }

  console.log('xToken.excludeFromFee >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

  const eff = async (account) => {
    if (!addresses.xTokenAddress || !account) {return}
    const xToken = (await ethers.getContractFactory('XToken')).attach(addresses.xTokenAddress)
    const excluded = await xToken.isExcludedFromFee(account)
    console.log(account, excluded)
    if (account && !excluded) {
      console.log('excludeFromFee ---------------------------------')
      await xToken.excludeFromFee(account, true)
    }
  }

}
