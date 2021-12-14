import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { configureBeaconDeployment } from '../../helpers/upgrade/v1.1.0/configureBeaconDeployment'
import { handleBeaconContractDeploy } from '../../helpers/upgrade/v1.1.0/handleBeaconContractDeploy'
import saveUpgradePopulatedTransactions from '../../helpers/files/saveUpgradePopulatedTransactions';

const upgradeBeaconEthereumMainnet = async (hardhat: HardhatRuntimeEnvironment) => {
  // @ts-ignore
  const { ethers, deployments, getNamedAccounts, getChainId } = hardhat
  const chainId = await getChainId();
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  if (process.env.DEPLOY === 'mainnet.upgrade.v1.1.0') {
    dim(`Deploying: Beacon Chain Ethereum Mainnet`)
    dim(`Version: 1.0.1 to 1.1.0`)
  } else { return }
  await handleBeaconContractDeploy(deploy, deployer, ethers)
  const populatedTransactions = await configureBeaconDeployment(ethers)
  saveUpgradePopulatedTransactions(populatedTransactions, `${__dirname}/populatedTransactions.beacon.${chainId}.json`)
  console.log(`Transactions Generated: deploy/v1.1.0/populatedTransactions.beacon.${chainId}.json`)
}

export default upgradeBeaconEthereumMainnet;