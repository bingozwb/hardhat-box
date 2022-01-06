const eventUtil = require('../js/eventUtil')

const fs = require('fs')
const path = require('path')


function genTestScript(_path, _contractJson, _addressStr) {

  let str = ''
  str = str + 'const {web3, property, deploy, sendSignedTx, sendSignedTxSimple, sendSignedTxHelper} = require(\'../js/contractUtil\')\n' +
    '\n' +
    'const contractJson = require(\'../build/contracts/' + _contractJson.contractName + '\')\n' +
    'const contractAddr = ' + _addressStr +'\n' +
    'const contractAbi = contractJson.abi\n' +
    'const contract = new web3.eth.Contract(contractAbi, contractAddr)\n' +
    '\n'
  str = str + 'module.exports = {\n'
  str = str + '\tcontractJson: contractJson,\n'
  str = str + '\tcontract: contract,\n'
  str = str + '\tgetInfo: async function () {\n'
  for (const item of _contractJson.abi) {
    if (item.type !== 'function') continue
    if ('view' === item.stateMutability && 0 === item.inputs.length) {
      str = str + '\t\tawait contract.methods.' + item.name + '().call().then(res => console.log(\'' + item.name + '\', res))\n'
    }
  }
  str = str + '\t},\n' +
    '\n'
  for (const item of _contractJson.abi) {
    if (item.type !== 'function') continue
    if ('view' === item.stateMutability) {
      let argStr = '('
      for (let i = 0; i < item.inputs.length; i++) {
        const argName = item.inputs[i].name ? item.inputs[i].name : '_' + item.inputs[i].type
        argStr = argStr + argName + (i === item.inputs.length -1 ? '' : ', ')
      }
      argStr = argStr + ')'
      str = str + '\t' + item.name + ': async function ' + argStr + ' {\n' +
        '\t\treturn contract.methods.' + item.name + argStr + '.call()\n' +
        '\t},\n'
    }
  }
  for (const item of _contractJson.abi) {
    if (item.type !== 'function') continue
    if ('nonpayable' === item.stateMutability) {
      let argStr = '('
      for (let i = 0; i < item.inputs.length; i++) {
        argStr = argStr + item.inputs[i].name + (i === item.inputs.length -1 ? '' : ', ')
      }
      argStr = argStr + ')'
      str = str + '\t' + item.name + ': async function ' + argStr + ' {\n' +
        '\t\tconst data = contract.methods.' + item.name + argStr + '.encodeABI()\n' +
        '\t\treturn sendSignedTxSimple(contractAddr, data)\n' +
        '\t},\n'
    }
    if ('payable' === item.stateMutability) {
      let argStr = '('
      for (let i = 0; i < item.inputs.length; i++) {
        argStr = argStr + item.inputs[i].name + ', '
      }
      argStr = argStr + '_eth)'
      str = str + '\t' + item.name + ': async function ' + argStr + ' {\n' +
        '\t\tconst data = contract.methods.' + item.name + argStr.replace(/(,\s)?_eth/, '') + '.encodeABI()\n' +
        '\t\treturn sendSignedTxSimple(contractAddr, data, _eth)\n' +
        '\t},\n'
    }
  }
  str = str + '}'

  fs.writeFile(_path, str, err => {
    if (err)
      console.log('err', err)
  })

}

function genSign() {
    CONTRACT_PATH = './contracts'
    BUILD_PATH = '../artifacts/contracts/'
    IGNORE_CONTRACT = ['BlindBox.sol', 'FishBox.sol']
    var fs = require('fs'),
    path = require('path');
    fs.readdirSync(CONTRACT_PATH).forEach(function (name) {
        if (IGNORE_CONTRACT.indexOf(name) < 0) {
            var filePath = path.join(CONTRACT_PATH, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                name = name.split(".")[0]
                filePath = BUILD_PATH + name + ".sol/" + name + ".json"

                console.log(name + ' function signature >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ')
                eventUtil.logFunctionSignature(require(filePath).abi)

                console.log(name + ' event signature >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ')
                eventUtil.logEventSignature(require(filePath).abi)
            }
        }
    });
}

function main() {
    genSign()
}

main()
