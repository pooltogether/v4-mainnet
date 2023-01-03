import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { dim, green } from '../../src/colors';
import { PRIZE_DISTRIBUTION_FACTORY_MINIMUM_PICK_COST } from '../../src/constants';
import { deployAndLog } from '../../src/deployAndLog';
import { setDrawCalculator } from '../../src/setDrawCalculator';
import { setManager } from '../../src/setManager';
import { transferOwnership } from '../../src/transferOwnership';

/**
 * Prepares a PoolTogether Prize Pool Network to update from using PrizeTierHistory
 * and PrizeDistributionFactory to using PrizeTierHistoryV2 and PrizeDistributionFactoryV2.
 *
 * NOTE: The final step to complete the update is a transition of the manager role on a PrizeDistributionBuffer to be the newly deployed PrizeDistributionFactoryV2 and to remove the DrawCalculatorTimelock by setting the DrawCalculator on the PrizeDistributor by calling setDrawCalculator().
 */
export default async function deployToAvalancheMainnet(hre: HardhatRuntimeEnvironment) {
  if (process.env.DEPLOY === 'v1.9.0.avalanche') {
    dim(`Deploying: PrizeTierHistoryV2 and PrizeDistributionFactoryV2 on Avalanche Mainnet`);
    dim(`Version: 1.10.0`);
  } else {
    return;
  }

  const { getNamedAccounts, ethers, getChainId } = hre;
  const { getContract } = ethers;

  const { deployer, executiveTeam, defenderRelayer } = await getNamedAccounts();

  const chainId = parseInt(await getChainId(), 10);

  dim(`chainId ${chainId} `);
  dim(`---------------------------------------------------`);
  dim(`Named Accounts`);
  dim(`---------------------------------------------------`);
  dim(`deployer: ${deployer}`);
  dim(`executiveTeam: ${executiveTeam}`);
  dim(`defenderRelayer: ${defenderRelayer}`);
  dim(`---------------------------------------------------\n`);
  const startingBalance = await ethers.provider.getBalance((await ethers.getSigners())[0].address);

  // ===================================================
  // Deploy Contracts
  // ===================================================

  // Load existing contracts
  const ticket = await hre.deployments.get('Ticket');
  const prizeDistributionBuffer = await hre.deployments.get('PrizeDistributionBuffer');
  const drawBuffer = await hre.deployments.get('DrawBuffer');

  // 1. Deploy or load PrizeTierHistoryV2
  const prizeTierHistoryV2 = await deployAndLog('PrizeTierHistoryV2', {
    from: deployer,
    args: [deployer],
    skipIfAlreadyDeployed: true,
  });

  // 2. Deploy or load PrizeDistributionFactoryV2
  const prizeDistributionFactoryV2 = await deployAndLog('PrizeDistributionFactoryV2', {
    from: deployer,
    args: [
      deployer,
      prizeTierHistoryV2.address,
      drawBuffer.address,
      prizeDistributionBuffer.address,
      ticket.address,
      PRIZE_DISTRIBUTION_FACTORY_MINIMUM_PICK_COST,
    ],
    skipIfAlreadyDeployed: true,
  });

  // 3. Load DrawCalculator
  const drawCalculatorContract = await getContract('DrawCalculator');

  // ===================================================
  // Configure Contracts
  // ===================================================

  // 1. Set Managers on new contracts
  await setManager('PrizeTierHistoryV2', null, executiveTeam);

  // 2. Transfer Ownership on new contracts
  await transferOwnership('PrizeTierHistoryV2', null, executiveTeam);
  await transferOwnership('PrizeDistributionFactoryV2', null, executiveTeam);

  // 3. Complete Migration of old system
  // transition to new Prize Distribution Factory
  await setManager('PrizeDistributionBuffer', null, prizeDistributionFactoryV2.address);

  // remove timelock
  await setDrawCalculator(drawCalculatorContract.address);

  dim(`---------------------------------------------------`);
  const costToDeploy = startingBalance.sub(
    await ethers.provider.getBalance((await ethers.getSigners())[0].address),
  );
  dim(`Deployment cost for deployer ${deployer}: ${ethers.utils.formatEther(costToDeploy)} AVAX`);
  dim(`---------------------------------------------------`);
}
