import { HardhatUserConfig } from 'hardhat/config';
const mnemonic = process.env.HDWALLET_MNEMONIC;

const networks: HardhatUserConfig['networks'] = {
  localhost: {
    url: 'http://127.0.0.1:8545'
  },
  hardhat: {
    allowUnlimitedContractSize: true,
    gas: 12000000,
    blockGasLimit: 0x1fffffffffffff,
    accounts: {
      mnemonic,
    },
  },
  mainnet: {
    chainId: 1,
    timeout: 1200000, // 20 minute timeout in ms
    url: process.env.MAINNET_RPC_URL,
    gasPrice: 80000000000,
    accounts: {
      mnemonic,
    },
  },
  polygon: {
    chainId: 137,
    url: process.env.POLYGON_RPC_URL,
    accounts: {
      mnemonic,
    },
  },
  avalanche: {
    chainId: 43114,
    gasPrice: 100000000000,
    // gas: 12000000,
    url: process.env.AVALANCHE_RPC_URL,
    accounts: {
      mnemonic,
    },
  }
}

if (!!process.env.FORK_ENABLED) {
  networks.hardhat = {
    chainId: parseInt(process.env.FORK_CHAIN_ID || "1"),
    ...networks.hardhat
  }
  networks.hardhat.forking = {
    enabled: !!process.env.FORK_ENABLED,
    url: process.env.FORK_RPC_URL || "",
    blockNumber: parseInt(process.env.FORK_BLOCK_NUMBER || "1")
  }
}

export default networks;
