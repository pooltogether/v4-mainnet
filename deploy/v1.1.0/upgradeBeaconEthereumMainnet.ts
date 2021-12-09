import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { configureBeaconDeployment } from '../../helpers/upgrade/v1.1.0/configureBeaconDeployment'
import { handleBeaconContractDeploy } from '../../helpers/upgrade/v1.1.0/handleBeaconContractDeploy'

const upgradeBeaconEthereumMainnet = async (hardhat: HardhatRuntimeEnvironment) => {
  // @ts-ignore
  const { ethers, deployments, getNamedAccounts } = hardhat
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  if (process.env.DEPLOY === 'mainnet.upgrade.v1.10.0') {
    dim(`Deploying: Beacon Chain Ethereum Mainnet`)
    dim(`Version: 1.0.1 to 1.1.0`)
  } else { return }
  // await handleBeaconContractDeploy(deploy, deployer, ethers)
  await configureBeaconDeployment(ethers)

  console.log('Transactions Generated: deploy/v1.1.0/populatedTransactions.json')
}

export default upgradeBeaconEthereumMainnet;