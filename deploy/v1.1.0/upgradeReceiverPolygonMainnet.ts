import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import saveUpgradePopulatedTransactions from '../../helpers/files/saveUpgradePopulatedTransactions';
import { configureBeaconDeployment } from '../../helpers/upgrade/v1.1.0/configureBeaconDeployment'
import { handleBeaconContractDeploy } from '../../helpers/upgrade/v1.1.0/handleBeaconContractDeploy'

const upgradeReceiverPolygonMainnet = async (hardhat: HardhatRuntimeEnvironment) => {
  // @ts-ignore
  const { ethers, deployments, getNamedAccounts, getChainId } = hardhat
  const chainId = await getChainId();
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  if (process.env.DEPLOY === 'polygon.upgrade.v1.10.0') {
    dim(`Deploying: Receiver Chain Ethereum Mainnet`)
    dim(`Version: 1.0.1 to 1.1.0`)
  } else { return }
  await handleBeaconContractDeploy(deploy, deployer, ethers)
  const populatedTransactions = await configureBeaconDeployment(ethers)
  saveUpgradePopulatedTransactions(populatedTransactions, `${__dirname}/populatedTransactions.receiver.${chainId}.json`)
  console.log(`Transactions Generated: deploy/v1.1.0/populatedTransactions.receiver.${chainId}.json`)
}

export default upgradeReceiverPolygonMainnet;