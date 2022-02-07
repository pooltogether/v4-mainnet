import { dim, red } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { deployAndLog } from '../../src/deployAndLog';

export default async function deployToPolygon(hardhat: HardhatRuntimeEnvironment) {
  if (process.env.DEPLOY === 'v1.2.1.polygon') {
    dim(`Deploying: TWAB Rewards Polygon Mainnet`)
    dim(`Version: 1.2.1`)
  } else { return }

  const { ethers } = hardhat;
  const { getContract, getSigners } = ethers;

  const [deployer] = await getSigners();

  const prizePool = await getContract('YieldSourcePrizePool');
  const ticket = await getContract('Ticket');

  // ===================================================
  // Deploy Contracts
  // ===================================================

  if (await prizePool.getTicket() === ticket.address) {
    await deployAndLog('TwabRewards', {
      from: deployer.address,
      args: [ticket.address],
      skipIfAlreadyDeployed: true,
    });
  } else {
    red('Pool ticket address does not match ticket contract address');
  }
}