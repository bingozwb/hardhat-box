const { ethers } = require('hardhat')

// constant
const MAX_UINT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

const processNonce = async (from) => {
  if (!process.env['nonce_' + from]) {
    process.env['nonce_' + from] = await ethers.provider.getTransactionCount(from)
  }
  console.debug(`nonce[${from}]`, process.env['nonce_' + from])

  return process.env['nonce_' + from]++
}

const erc20BalanceOf = async (contract, from) => {
  const balance = await contract.balanceOf(from)
  console.debug(`[${contract.address}] balanceOf ${from}`, toEther(balance))
  return balance
}

const erc20Approve = async (contract, from, spender) => {
  const allowance = await contract.allowance(from, spender)
  console.debug('allowance', toEther(allowance))
  if (0 >= allowance) {
    await contract.approve(spender, MAX_UINT)
  }
}

const nftApprove = async (contract, from, spender) => {
  const isApprovedForAll = await contract.isApprovedForAll(from, spender)
  console.debug('isApprovedForAll', isApprovedForAll)
  if (!isApprovedForAll) {
    await contract.setApprovalForAll(spender, true)
  }
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const toEther = (v) => {
  return ethers.utils.formatEther(v)
}

const toWei = (v) => {
  return ethers.utils.parseEther(v)
}

const decodeFunction = async (contract, txHash) => {
  let contractABI
  if (typeof contract === 'string') {
    contractABI = (await ethers.getContractFactory(contract)).interface
  } else {
    contractABI = contract.interface
  }
  const transaction = await ethers.provider.getTransaction(txHash)
  const functionFragment = contractABI.getFunction(transaction.data.substr(0, 10))
  const functionData = contractABI.decodeFunctionData(functionFragment, transaction.data)
  console.debug(`functionData [${functionFragment.name}]`, functionData)
  return functionData
}

module.exports = { sleep, processNonce, erc20BalanceOf, erc20Approve, nftApprove, toWei, toEther, decodeFunction }
