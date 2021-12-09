import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const upgradeBeaconEthereumMainnnet = async (hardhat: HardhatRuntimeEnvironment) => {
  // @ts-ignore
  const { ethers, deployments, getNamedAccounts } = hardhat
  const { deployer, manager } = await getNamedAccounts();
  const { deploy } = deployments;

  if (process.env.DEPLOY === 'mainnet.upgrade.v1.10.0') {
    dim(`Upgrading: Beacon Chain Ethereum Mainnet`)
    dim(`Version: 1.0.1 to 1.1.0`)
  } else { return }

}

export default upgradeBeaconEthereumMainnnet;