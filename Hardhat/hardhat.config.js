require('@openzeppelin/hardhat-upgrades');

require('dotenv').config();

const mnemonic = process.env.MNEMONIC2;
module.exports = {
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    amoy: {
      url: process.env.URL_AMOY,
      accounts: { mnemonic },
      chainId: 80002,
    },
    sepolia: {
      url: process.env.URL_SEPOLIA,
      accounts: { mnemonic },
      chainId: 11155111,
    },
  },

  etherscan: {
    // customChains: [
    //   {
    //     network: 'amoy',
    //     chainId: 80002,
    //     urls: {
    //       apiURL: 'https://api-amoy.polygonscan.com/api',
    //       browserURL: 'https://amoy.polygonscan.com',
    //     },
    //   },
    // ],
    // apiKey: process.env.POLYGONSCAN_API_KEY,

    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
