import { dim, red } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { deployAndLog } from '../../src/deployAndLog';

export default async function deployToEthereumMainnet(hardhat: HardhatRuntimeEnvironment){
  if (process.env.DEPLOY === 'v1.2.1.mainnet') {
    dim(`Deploying: TWAB Rewards Ethereum Mainnet`)
    dim(`Version: 1.2.1`)
  } else { return }

  const { getNamedAccounts, ethers } = hardhat;
  const { getContract } = ethers;

  const { deployer } = await getNamedAccounts();

  const prizePool = await getContract('YieldSourcePrizePool');
  const ticket = await getContract('Ticket');

  // ===================================================
  // Deploy Contracts
  // ===================================================

  if (await prizePool.getTicket() === ticket.address) {
    await deployAndLog('TwabRewards', {
      from: deployer,
      args: [ticket.address],
      skipIfAlreadyDeployed: true,
    });
  } else {
    red('Pool ticket address does not match ticket contract address');
  }
}
