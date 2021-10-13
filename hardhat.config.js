const networks = require('./hardhat.network')
require('hardhat-dependency-compiler')
require('hardhat-deploy')
require('hardhat-deploy-ethers')
require('@pooltogether/hardhat-deploy-markdown-export')

// Tasks
require('./tasks/calculations')
require('./tasks/administrative')
require('./tasks/DrawBuffer')
require('./tasks/PrizeDistributor')
require('./tasks/PrizeDistributionBuffer')
require('./tasks/PrizePool')
require('./tasks/Ticket')
require('./tasks/PrizeTierHistory')

const debug = require('debug')('pt:hardhat.config')

const optimizerEnabled = true

const config = {
  networks,
  defaultNetwork: 'mainnet',
  solidity: {
    compilers: [
      {
        version: '0.8.6',
        settings: {
          optimizer: {
            enabled: optimizerEnabled,
            runs: 2000,
          },
          evmVersion: 'berlin',
        },
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
    executiveTeam: {
      default: 0,
      1: '0xDa63D70332139E6A8eCA7513f4b6E2E0Dc93b693',
      137: '0xd2146c8D93fD7Edd45C07634af7038E825880a64' // ptOperations
    },
    ptOperations: {
      default: 0,
      1: '0x029Aa20Dcc15c022b1b61D420aaCf7f179A9C73f',
      137: '0xd2146c8D93fD7Edd45C07634af7038E825880a64'
    },
    defenderRelayer: {
      default: 0,
      1: '0xdd0134236ab968f39c1ccfc5d3d0de577f73b6d7',
      137: '0x167cb192f7eab0951b7b742e97a8207e209e15cb'
    },
    aUSDC: {
      1: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
      137: '0x1a13F4Ca1d028320A707D99520AbFefca3998b7F'
    },
    aaveIncentivesController: {
      1: '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
      137: '0x357D51124f59836DeD84c8a1730D72B749d8BC23'
    },
    aaveLendingPoolAddressesProviderRegistry: {
      1: '0x52D306e36E3B6B02c153d0266ff0f85d18BCD413',
      137: '0x3ac4e9aa29940770aeC38fe853a4bbabb2dA9C19'
    }
  },
  external: {
    contracts: [
      {
        artifacts: "node_modules/@pooltogether/pooltogether-rng-contracts/build",
      },
      {
        artifacts: "node_modules/@pooltogether/yield-source-interface/artifacts"
      }
    ],
    deployments: {
      mainnet: ["node_modules/@pooltogether/pooltogether-rng-contracts/deployments/mainnet"],
      polygon: ["node_modules/@pooltogether/pooltogether-rng-contracts/deployments/matic_137"],
    },
  },
  dependencyCompiler: {
    paths: [
      // Core
      "@pooltogether/v4-core/contracts/DrawBeacon.sol",
      "@pooltogether/v4-core/contracts/DrawCalculator.sol",
      "@pooltogether/v4-core/contracts/DrawBuffer.sol",
      "@pooltogether/v4-core/contracts/PrizeDistributor.sol",
      "@pooltogether/v4-core/contracts/PrizeDistributionBuffer.sol",
      "@pooltogether/v4-core/contracts/Ticket.sol",
      "@pooltogether/v4-core/contracts/prize-strategy/PrizeSplitStrategy.sol",
      "@pooltogether/v4-core/contracts/Reserve.sol",
      "@pooltogether/v4-core/contracts/prize-pool/YieldSourcePrizePool.sol",
      "@pooltogether/v4-core/contracts/test/ERC20Mintable.sol",
      // Timelock
      "@pooltogether/v4-timelocks/contracts/L1TimelockTrigger.sol",
      "@pooltogether/v4-timelocks/contracts/L2TimelockTrigger.sol",
      "@pooltogether/v4-timelocks/contracts/DrawCalculatorTimelock.sol",
      // Periphery
      "@pooltogether/v4-periphery/contracts/PrizeFlush.sol",
      "@pooltogether/v4-periphery/contracts/PrizeTierHistory.sol",
      // yield source
      "@pooltogether/aave-yield-source/contracts/yield-source/ATokenYieldSource.sol"
    ]
  }
};


if (process.env.FORK_CHAIN_ID == process.env.MAINNET_CHAIN_ID) {
  debug(`Setting up RNG contracts for mainnet`)
  config.external.deployments.hardhat = config.external.deployments.mainnet
  config.external.deployments.localhost = config.external.deployments.mainnet
} else if (process.env.FORK_CHAIN_ID == process.env.POLYGON_CHAIN_ID) {
  debug(`Setting up RNG contracts for polygon`)
  config.external.deployments.hardhat = config.external.deployments.polygon
  config.external.deployments.localhost = config.external.deployments.polygon
}

module.exports = config