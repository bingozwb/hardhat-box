const ethers = require('ethers')

const fs = require('fs')
const path = require('path')

CONTRACT_PATH = './contracts'
BUILD_PATH = '../artifacts/contracts/'
IGNORE_CONTRACT = ['Ignore.sol',]

function genSign () {
  fs.readdirSync(CONTRACT_PATH).forEach(function (name) {
    if (IGNORE_CONTRACT.indexOf(name) < 0) {
      let filePath = path.join(CONTRACT_PATH, name)
      const stat = fs.statSync(filePath)
      if (stat.isFile()) {
        name = name.split('.')[0]
        filePath = BUILD_PATH + name + '.sol/' + name + '.json'

        try {
          let contractJson = require(filePath)
          const contractFactory = ethers.ContractFactory.fromSolidity(contractJson)

          console.log(`[${name}]` + ' function signature >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ')
          logFunctionSignature(contractFactory.interface)

          console.log(`[${name}]` + ' event signature >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ')
          logEventSignature(contractFactory.interface)
        } catch (e) {
          console.error('json not exist', filePath)
        }
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
  const events = _abi.events
  for (const key in events) {
    const item = events[key]
    if (item.type !== 'event') continue
    console.log(item.name + ':', _abi.getEventTopic(key))
  }
}

function test () {
  genSign()
}

test()
