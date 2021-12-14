import { HardhatUserConfig } from 'hardhat/config';
import networks from './hardhat.network';
import { dependencyCompiler, external } from './hardhat.config.dependencies'
import namedAccounts from './hardhat.config.namedAccounts'
import 'hardhat-dependency-compiler';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import '@pooltogether/hardhat-deploy-markdown-export';

const optimizerEnabled = true
const config: HardhatUserConfig = {
  networks,
  defaultNetwork: 'mainnet',
  dependencyCompiler,
  external,
  namedAccounts,
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

export default config