const ethers = require('ethers')

const fs = require('fs')
const path = require('path')

CONTRACT_PATH = './contracts'
BUILD_PATH = '../artifacts/contracts/'
IGNORE_CONTRACT = ['BlindBox.sol', 'FishBox.sol']

function genSign () {
  fs.readdirSync(CONTRACT_PATH).forEach(function (name) {
    if (IGNORE_CONTRACT.indexOf(name) < 0) {
      let filePath = path.join(CONTRACT_PATH, name)
      const stat = fs.statSync(filePath)
      if (stat.isFile()) {
        name = name.split('.')[0]
        filePath = BUILD_PATH + name + '.sol/' + name + '.json'

        const contractFactory = ethers.ContractFactory.fromSolidity(require(filePath))

        console.log(`[${name}]` + ' function signature >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ')
        logFunctionSignature(contractFactory.interface)

        console.log(`[${name}]` + ' event signature >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ')
        logEventSignature(contractFactory.interface.events)
      }
    }
  })
}

const logFunctionSignature = function (_abi, view) {
  const functions = _abi.functions
  for (const key in functions) {
    const item = functions[key]
    if ('nonpayable' === item.stateMutability || 'payable' === item.stateMutability || view) {
      console.log(item.name + ':', _abi.getSighash(item))
    }
  }
}

const logEventSignature = function (_abi) {
  for (const key in _abi) {
    const item = _abi[key]
    if (item.type !== 'event') continue
    console.log(item.name + ':', ethers.utils.id(key))
  }
}

function test () {
  genSign()
}

test()
