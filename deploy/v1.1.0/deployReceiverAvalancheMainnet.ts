import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import {
  handlePrizePoolCoreDeploy,
  handlePeripheryContractDeploy,
  handleReceiverChainContractDeploy,
  configureReceiverChainDeployment
} from '../../helpers'
import {
  DRAW_BUFFER_CARDINALITY,
  PRIZE_DISTRIBUTION_BUFFER_CARDINALITY,
  TOKEN_DECIMALS
} from '../../helpers/constants'

const deployReceiverAvalancheMainnet = async (hardhat: HardhatRuntimeEnvironment) => {
  // @ts-ignore
  const { ethers, deployments, getNamedAccounts } = hardhat
  const { deployer, executiveTeam } = await getNamedAccounts();
  const { deploy } = deployments;
  if (process.env.DEPLOY === 'avalanche.deploy.v1.10.0') {
    dim(`Deploying: Receiver Chain Avalanche Mainnet`)
    dim(`Version: 1.0.1 to 1.1.0`)
  } else { return }
  await handlePrizePoolCoreDeploy(deploy, deployer, ethers, getNamedAccounts, TOKEN_DECIMALS, DRAW_BUFFER_CARDINALITY, PRIZE_DISTRIBUTION_BUFFER_CARDINALITY);
  await handlePeripheryContractDeploy(deploy, deployer, ethers);
  await handleReceiverChainContractDeploy(deploy, deployer, ethers);
  await configureReceiverChainDeployment(ethers, executiveTeam)
}

export default deployReceiverAvalancheMainnet;