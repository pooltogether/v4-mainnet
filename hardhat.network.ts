import { HardhatUserConfig } from 'hardhat/config';
const mnemonic = process.env.HDWALLET_MNEMONIC;
const infuraApiKey = process.env.INFURA_API_KEY;
const avalanche = process.env.AVALANCHE_ENABLED;

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
  polygon: {
    chainId: 137,
    url: process.env.POLYGON_RPC_URL,
    accounts: {
      mnemonic,
    },
  },
  mainnet: {
    chainId: 1,
    timeout: 1200000, // 20 minute timeout in ms
    url: process.env.MAINNET_RPC_URL,
    gasPrice: 200000000000,
    accounts: {
      mnemonic,
    },
  },
  mumbai: {
    chainId: 80001,
    url: 'https://rpc-mumbai.maticvigil.com',
    accounts: {
      mnemonic,
    },
  },
  rinkeby: {
    chainId: 4,
    url: `https://rinkeby.infura.io/v3/${infuraApiKey}`,
    accounts: {
      mnemonic,
    },
  }
};

if (!!avalanche) {
  networks.avalancheMainnet = {
    chainId: 43114,
    gas: 12000000,
    url: 'https://api.avax.network/ext/bc/C/rpc',
    accounts: {
      mnemonic,
    },
  }

  networks.avalancheFuji = {
    chainId: 43113,
    url: 'https://api.avax-test.network/ext/bc/C/rpc',
    accounts: {
      mnemonic,
    },
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
}

export default networks;