import { HardhatUserConfig } from 'hardhat/config';
import 'hardhat-dependency-compiler';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@pooltogether/hardhat-deploy-markdown-export';

import networks from './hardhat.network';
import { dependencyCompiler, external } from './hardhat.config.dependencies';
import {
  AVALANCHE_CHAIN_ID,
  ETHEREUM_MAINNET_CHAIN_ID,
  OPTIMISM_CHAIN_ID,
  POLYGON_CHAIN_ID,
} from './src/constants';

// Hardhat Tasks
import './tasks/Ticket';
import './tasks/Manageable';

const optimizerEnabled = true;
const config: HardhatUserConfig = {
  networks,
  defaultNetwork: 'mainnet',
  dependencyCompiler,
  external,
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    rngService: {
      [ETHEREUM_MAINNET_CHAIN_ID]: '0xB2DC5571f477b1C5b36509a71013BFedD9Cc492F',
    },
    executiveTeam: {
      default: 0,
      [ETHEREUM_MAINNET_CHAIN_ID]: '0xDa63D70332139E6A8eCA7513f4b6E2E0Dc93b693',
      [POLYGON_CHAIN_ID]: '0x3feE50d2888F2F7106fcdC0120295EBA3ae59245',
      [AVALANCHE_CHAIN_ID]: '0x6323A881Ea07f64dD8ec67B15fBB5dC6383eFAc6',
      [OPTIMISM_CHAIN_ID]: '0x8d352083F7094dc51Cd7dA8c5C0985AD6e149629',
    },
    prizeTeam: {
      default: 0,
      [ETHEREUM_MAINNET_CHAIN_ID]: '0xB87b4E170A8Ec9Ee0faDD451c15e1D04df535855',
      [POLYGON_CHAIN_ID]: '0x5bC3D2d94751211A1b7Dec1848EA3664DAF0b194',
      [AVALANCHE_CHAIN_ID]: '0x49Bf8d9B1a535D6f7ddb7F94762282249530ecDa',
      [OPTIMISM_CHAIN_ID]: '0x2AA9c535101554d1B48B911625030Cbc53c8fBcF',
    },
    ptOperations: {
      default: 0,
      [ETHEREUM_MAINNET_CHAIN_ID]: '0x029Aa20Dcc15c022b1b61D420aaCf7f179A9C73f',
      [POLYGON_CHAIN_ID]: '0xd2146c8D93fD7Edd45C07634af7038E825880a64',
      [AVALANCHE_CHAIN_ID]: '0x9E5DA149A33f071B8870de01afC747224FA0c654',
      [OPTIMISM_CHAIN_ID]: '',
    },
    defenderRelayer: {
      default: 0,
      [ETHEREUM_MAINNET_CHAIN_ID]: '0xdd0134236Ab968f39C1CCFC5d3D0de577f73B6d7',
      [POLYGON_CHAIN_ID]: '0x167CB192f7eAB0951b7B742E97A8207E209e15Cb',
      [AVALANCHE_CHAIN_ID]: '0xaBcD4a0093232d729210c17B35b6aA8f66CaB925',
      [OPTIMISM_CHAIN_ID]: '0xC7Bd2c88c1e076701A0Ad0125484bf2Fd9c5c562',
    },
    aUSDC: {
      [ETHEREUM_MAINNET_CHAIN_ID]: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
      [POLYGON_CHAIN_ID]: '0x1a13F4Ca1d028320A707D99520AbFefca3998b7F',
      [AVALANCHE_CHAIN_ID]: '0x46A51127C3ce23fb7AB1DE06226147F446e4a857',
      [OPTIMISM_CHAIN_ID]: '0x625E7708f30cA75bfd92586e17077590C60eb4cD',
    },
    aaveIncentivesController: {
      [ETHEREUM_MAINNET_CHAIN_ID]: '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
      [POLYGON_CHAIN_ID]: '0x357D51124f59836DeD84c8a1730D72B749d8BC23',
      [AVALANCHE_CHAIN_ID]: '0x01D83Fe6A10D2f2B7AF17034343746188272cAc9',
      [OPTIMISM_CHAIN_ID]: '0x929EC64c34a17401F460460D4B9390518E5B473e',
    },
    aaveLendingPoolAddressesProviderRegistry: {
      [ETHEREUM_MAINNET_CHAIN_ID]: '0x52D306e36E3B6B02c153d0266ff0f85d18BCD413',
      [POLYGON_CHAIN_ID]: '0x3ac4e9aa29940770aeC38fe853a4bbabb2dA9C19',
      [AVALANCHE_CHAIN_ID]: '0x4235E22d9C3f28DCDA82b58276cb6370B01265C2',
      [OPTIMISM_CHAIN_ID]: '0x770ef9f4fe897e59daCc474EF11238303F9552b6',
    },
    messageExecutor: {
      [OPTIMISM_CHAIN_ID]: '0x890a87E71E731342a6d10e7628bd1F0733ce3296',
    },
  },
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
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: optimizerEnabled,
            runs: 2000,
          },
          evmVersion: 'london',
        },
      },
    ],
  },
};

export default config;
