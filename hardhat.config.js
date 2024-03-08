require('@nomiclabs/hardhat-waffle')

// hardhat upgrade plugins
require('@nomiclabs/hardhat-ethers')
require('@openzeppelin/hardhat-upgrades')
// hardhat etherscan plugins
require('@nomiclabs/hardhat-etherscan')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.5.16',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      forking: { // https://hardhat.org/hardhat-network/docs/guides/forking-other-networks
        url: '',
        enabled: false,
      },
      accounts: {
        mnemonic: ''
      },
      gas: 'auto',
    },
    bsct: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      accounts: {
        mnemonic: '',
        initialIndex: 0
      },
      gas: 'auto',
      // gas: 30000000,
    },
    bsc: { // https://docs.binance.org/smart-chain/wallet/metamask.html
      url: 'https://bsc-dataseed.binance.org/',
      accounts: {
        mnemonic: '',
        initialIndex: 0
      },
      gas: 'auto',
    },
    okt: {
      url: 'https://exchaintestrpc.okex.org',
      accounts: {
        mnemonic: '',
        initialIndex: 0
      },
      gas: 'auto',
      // gas: 30000000,
    },
    oec: { // https://okexchain-docs.readthedocs.io/en/latest/developers/quick-start-for-mainnet.html
      url: 'https://exchainrpc.okex.org',
      accounts: {
        mnemonic: '',
        initialIndex: 0
      },
      gas: 'auto',
    },
    hecot: {
      url: 'https://http-testnet.hecochain.com',
      accounts: {
        mnemonic: '',
        initialIndex: 0
      },
      gas: 'auto',
      // gas: 30000000,
    },
    heco: { // https://docs.hecochain.com/#/wallet
      url: 'https://http-mainnet.hecochain.com',
      accounts: {
        mnemonic: '',
        initialIndex: 0
      },
      gas: 'auto',
    },
    goerli: {
      url: 'https://goerli.infura.io/v3/',
      accounts: {
        mnemonic: '',
        initialIndex: 0
      },
      gas: 'auto',
    },
    eth: {
      url: 'https://mainnet.infura.io/v3/',
      accounts: {
        mnemonic: '',
        initialIndex: 0
      },
      gas: 'auto',
    },
  },
  etherscan: { // https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan#hardhat-etherscan
    // Your API key for Etherscan
    // Obtain one at https://bscscan.com/
    apiKey: {
      mainnet: '',
      bsc: '',
      bscTestnet: ''
    }
  },
}
