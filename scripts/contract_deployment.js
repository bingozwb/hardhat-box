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

module.exports.upgrade = async (contractName, contractAddress) => {
    console.log('upgrade >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', contractName)
    const contractFactory = await ethers.getContractFactory(contractName)
    const contract = await upgrades.upgradeProxy(contractAddress, contractFactory, {})
    console.log('upgrade:', contract.address)
}

module.exports.set = async (addresses) => {
    console.log('setConfigNameOf >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

    const configBase = (await ethers.getContractFactory('ConfigBase')).attach(addresses.configBaseAddress)
    const ca = async (contractName, contractAddress) => {
        const configAddress = await configBase.configNameOf(ethers.utils.toUtf8Bytes(contractName))
        console.log(contractName, configAddress, configAddress === contractAddress)
        if (contractAddress && configAddress !== contractAddress) {
            console.log('setConfigNameOf ---------------------------------', contractName, contractAddress)
            await configBase.setConfigNameOf(ethers.utils.toUtf8Bytes(contractName), contractAddress)
        }
    }


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

}

module.exports.deployConfigBase = async (addresses) => {
    console.log("deployConfigBase >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    const ConfigBase = await ethers.getContractFactory('ConfigBase')
    const contract = await upgrades.deployProxy(ConfigBase, [], {})
    await contract.deployed()
    console.log('contractAddress:', contract.address)

    return contract.address
}

module.exports.deployERC20Token = async () => {
    console.log('deployERC20Token >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    const ERC20Token = await ethers.getContractFactory('ERC20TokenUpgradeable')
    const args = ['ERC20 Token', 'T', 18, 270_000_000]
    const contract = await upgrades.deployProxy(ERC20Token, args, {})
    console.log('contractAddress:', contract.address)

    console.log('configBase.setConfigNameOf ---------------------------------')
    const configBase = (await ethers.getContractFactory('ConfigBase')).attach(addrObj.configBaseAddress)
    await configBase.setConfigNameOf(ethers.utils.toUtf8Bytes('ERC20Token'), contract.address)

    return contract.address
}

module.exports.deployAdminConf = async (addresses) => {
    console.log('deployAdminConf >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    const AdminConf = await ethers.getContractFactory('AdminConf')
    const contract = await AdminConf.deploy()
    console.log('contractAddress:', contract.address)

    console.log('configBase.setConfigNameOf ---------------------------------')
    const configBase = (await ethers.getContractFactory('ConfigBase')).attach(addresses.configBaseAddress)
    await configBase.setConfigNameOf(ethers.utils.toUtf8Bytes('AdminConf'), contract.address)

    return contract.address
}
