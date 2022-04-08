import { HardhatUserConfig } from 'hardhat/config';
import 'hardhat-dependency-compiler';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@pooltogether/hardhat-deploy-markdown-export';

import networks from './hardhat.network';
import { dependencyCompiler, external } from './hardhat.config.dependencies';

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
      1: '0xB2DC5571f477b1C5b36509a71013BFedD9Cc492F',
    },
    executiveTeam: {
      default: 0,
      1: '0xDa63D70332139E6A8eCA7513f4b6E2E0Dc93b693',
      137: '0x3feE50d2888F2F7106fcdC0120295EBA3ae59245',
      43114: '0x6323A881Ea07f64dD8ec67B15fBB5dC6383eFAc6',
    },
    ptOperations: {
      default: 0,
      1: '0x029Aa20Dcc15c022b1b61D420aaCf7f179A9C73f',
      137: '0xd2146c8D93fD7Edd45C07634af7038E825880a64',
      43114: '0x9E5DA149A33f071B8870de01afC747224FA0c654',
    },
    defenderRelayer: {
      default: 0,
      1: '0xdd0134236Ab968f39C1CCFC5d3D0de577f73B6d7',
      137: '0x167CB192f7eAB0951b7B742E97A8207E209e15Cb',
      43114: '0xaBcD4a0093232d729210c17B35b6aA8f66CaB925',
    },
    aUSDC: {
      1: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
      137: '0x1a13F4Ca1d028320A707D99520AbFefca3998b7F',
      43114: '0x46A51127C3ce23fb7AB1DE06226147F446e4a857',
    },
    aaveIncentivesController: {
      1: '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
      137: '0x357D51124f59836DeD84c8a1730D72B749d8BC23',
      43114: '0x01D83Fe6A10D2f2B7AF17034343746188272cAc9',
    },
    aaveLendingPoolAddressesProviderRegistry: {
      1: '0x52D306e36E3B6B02c153d0266ff0f85d18BCD413',
      137: '0x3ac4e9aa29940770aeC38fe853a4bbabb2dA9C19',
      43114: '0x4235E22d9C3f28DCDA82b58276cb6370B01265C2',
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
    ],
  },
};

export default config;
