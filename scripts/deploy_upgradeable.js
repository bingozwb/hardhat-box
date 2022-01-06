// scripts/deploy_upgradeable_box.js
const {ethers, upgrades} = require('hardhat')

const property = require('../.env.' + [process.env.network])

// specify deploy function
if (!process.env.deploy) {
    process.env.deploy = 'deployContract'
}

// addresses storage
let addrObj = JSON.parse(JSON.stringify(property.addr))

module.exports.print = async () => {
    let arr = []
    for (const key in addrObj) {
        arr.push(key)
    }
    arr.sort()

    for (const i in arr) {
        console.log(arr[i] + ': \'' + addrObj[arr[i]] + '\',')
    }
}

/**
 * deploy contract
 */
module.exports.deployContract = async () => {
    try {
        addrObj.configBaseAddress = await this.deployConfigBase()
        addrObj.erc20TokenAddress = await this.deployERC20Token()
    } catch (e) {
        console.error(e)
    } finally {
        this.print()
    }

}

module.exports.upgradeContract = async () => {

}

module.exports.upgrade = async (contractName, contractAddress) => {
    console.log('upgrade >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', contractName)
    const contractFactory = await ethers.getContractFactory(contractName)
    const contract = await upgrades.upgradeProxy(contractAddress, contractFactory, {})
    console.log('upgrade:', contract.address)
}

module.exports.deployConfigBase = async () => {
    console.log('deployConfigBase >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    const ConfigBase = await ethers.getContractFactory('ConfigBase')
    const contract = await upgrades.deployProxy(ConfigBase, [], {})
    console.log('contractAddress:', contract.address)

    return contract.address
}

module.exports.deployERC20Token = async () => {
    console.log('deployERC20Token >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    const ERC20Token = await ethers.getContractFactory('ERC20Token')
    const args = ['ERC20 Token', 'T', 18, 270_000_000]
    const contract = await upgrades.deployProxy(ERC20Token, args, {})
    console.log('contractAddress:', contract.address)

    console.log('configBase.setConfigNameOf ---------------------------------')
    const configBase = (await ethers.getContractFactory('ConfigBase')).attach(addrObj.configBaseAddress)
    await configBase.setConfigNameOf(ethers.utils.toUtf8Bytes('ERC20Token'), contract.address)

    return contract.address
}

this[process.env.deploy]()
