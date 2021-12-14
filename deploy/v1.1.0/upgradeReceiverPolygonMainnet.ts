import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { configureReceiverDeployment } from '../../helpers/upgrade/v1.1.0/upgrade/configureReceiverDeployment'
import { handleReceiverContractDeploy } from '../../helpers/upgrade/v1.1.0/upgrade/handleReceiverContractDeploy'
import saveUpgradePopulatedTransactions from '../../helpers/files/saveUpgradePopulatedTransactions';

const upgradeReceiverPolygonMainnet = async (hardhat: HardhatRuntimeEnvironment) => {
  // @ts-ignore
  const { ethers, deployments, getNamedAccounts, getChainId } = hardhat
  const chainId = await getChainId();
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  if (process.env.DEPLOY === 'polygon.upgrade.v1.1.0') {
    dim(`Deploying: Receiver Chain Polygon Mainnet`)
    dim(`Version: 1.0.1 to 1.1.0`)
  } else { return }
  await handleReceiverContractDeploy(deploy, deployer, ethers)
  const populatedTransactions = await configureReceiverDeployment(ethers)
  saveUpgradePopulatedTransactions(populatedTransactions, `${__dirname}/populatedTransactions.receiver.${chainId}.json`)
  console.log(`Transactions Generated: deploy/v1.1.0/populatedTransactions.receiver.${chainId}.json`)
}

export default upgradeReceiverPolygonMainnet;