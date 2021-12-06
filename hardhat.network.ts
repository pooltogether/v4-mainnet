const mnemonic = process.env.HDWALLET_MNEMONIC;
const infuraApiKey = process.env.INFURA_API_KEY;
const forkChainId = process.env.FORK_CHAIN_ID || "1";
const forkBlockNumber = process.env.FORK_BLOCK_NUMBER || "0";

const networks = {
  localhost: {
    url: 'http://127.0.0.1:8545'
  },
  hardhat: {
    chainId: parseInt(forkChainId),
    allowUnlimitedContractSize: true,
    gas: 12000000,
    blockGasLimit: 0x1fffffffffffff,
    forking: {
      enabled: !!process.env.FORK_ENABLED,
      url: process.env.FORK_RPC_URL,
      blockNumber: parseInt(forkBlockNumber)
    },
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

export default networks;
