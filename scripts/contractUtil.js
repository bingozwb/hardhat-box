const fs = require('fs')
const readline = require('readline')


const {ethers, upgrades} = require('hardhat')

// constant
const MAX_UINT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

const processNonce = async (from) => {
  if (!process.env['nonce_' + from]) {
    process.env['nonce_' + from] = await ethers.provider.getTransactionCount(from)
  }
  console.log(`nonce[${from}]`, process.env['nonce_' + from])

  return process.env['nonce_' + from]++
}

const erc20BalanceOf = async (contract, from) => {
  const balance = await contract.balanceOf(from)
  console.log('balance', ethers.utils.parseEther(balance), balance)
}

const erc20Approve = async (contract, from, spender) => {
  if (0 >= await contract.allowance(from, spender)) {
    await contract.approve(spender, MAX_UINT)
  }
}

const nftApprove = async (contract, from, spender) => {
  if (!(await contract.isApprovedForAll(from, spender))) {
    await contract.setApprovalForAll(spender, true)
  }
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export {sleep, processNonce, erc20BalanceOf, erc20Approve, nftApprove}
