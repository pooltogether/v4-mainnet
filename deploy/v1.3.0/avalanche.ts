import { dim, red } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { deployAndLog } from '../../src/deployAndLog';

export default async function deployToAvalanche(hardhat: HardhatRuntimeEnvironment) {
  if (process.env.DEPLOY === 'v1.3.0.avalanche') {
    dim(`Deploying: TWAB Delegator Avalanche Mainnet`);
    dim(`Version: 1.3.0`);
  } else {
    return;
  }

  const { getNamedAccounts, ethers } = hardhat;
  const { getContract } = ethers;

  const { deployer } = await getNamedAccounts();

  const prizePool = await getContract('YieldSourcePrizePool');
  const ticket = await getContract('Ticket');

  // ===================================================
  // Deploy Contracts
  // ===================================================

  if (await prizePool.getTicket() === ticket.address) {
    await deployAndLog('TWABDelegator', {
      from: deployer,
      args: ['PoolTogether Staked avUSDCe Ticket', 'stkPTavUSDCe', ticket.address],
      skipIfAlreadyDeployed: true,
    });
  } else {
    red('Pool ticket address does not match ticket contract address');
  }
}
