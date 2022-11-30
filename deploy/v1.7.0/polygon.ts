import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { dim } from '../../src/colors';
import { PRIZE_DISTRIBUTION_FACTORY_MINIMUM_PICK_COST } from '../../src/constants';
import { deployAndLog } from '../../src/deployAndLog';
import { setManager } from '../../src/setManager';
import { transferOwnership } from '../../src/transferOwnership';

/**
 * Prepares a PoolTogether Prize Pool Network to update from using PrizeTierHistory
 * and PrizeDistributionFactory to using PrizeTierHistoryV2 and PrizeDistributionFactoryV2.
 *
 * NOTE: The final step to complete the update is a transition of the manager role on a PrizeDistributionBuffer to be the newly deployed PrizeDistributionFactoryV2.
 */
export default async function deployToPolygonMainnet(hre: HardhatRuntimeEnvironment) {
  if (process.env.DEPLOY === 'v1.7.0.polygon') {
    dim(`Deploying: PrizeTierHistoryV2 and PrizeDistributionFactoryV2 on Polygon Mainnet`);
    dim(`Version: 1.7.0`);
  } else {
    return;
  }

  const { getNamedAccounts, ethers, getChainId } = hre;

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

  const ticket = await hre.deployments.get('Ticket');
  const pdb = await hre.deployments.get('PrizeDistributionBuffer');
  const db = await hre.deployments.get('DrawBuffer');

  // 1. Deploy or load PrizeTierHistoryV2
  const pthv2 = await deployAndLog('PrizeTierHistoryV2', {
    from: deployer,
    args: [deployer],
    skipIfAlreadyDeployed: true,
  });

  // 2. Deploy or load PrizeDistributionFactoryV2
  const pdfv2 = await deployAndLog('PrizeDistributionFactoryV2', {
    from: deployer,
    args: [
      deployer,
      pthv2.address,
      db.address,
      pdb.address,
      ticket.address,
      PRIZE_DISTRIBUTION_FACTORY_MINIMUM_PICK_COST,
    ],
    skipIfAlreadyDeployed: true,
  });

  // ===================================================
  // Configure Contracts
  // ===================================================

  // 1. Set Manager of PTHV2 to Executive Team
  await setManager('PrizeTierHistoryV2', null, executiveTeam);

  // 2. Set Manager of PDFV2 to Defender Relayer
  await setManager('PrizeDistributionFactoryV2', null, defenderRelayer);

  // 3. Transfer Ownership of PTHV2 to Executive Team
  await transferOwnership('PrizeTierHistoryV2', null, executiveTeam);

  // 4. Transfer Ownership of PDFV2 to Executive Team
  await transferOwnership('PrizeDistributionFactoryV2', null, executiveTeam);

  dim(`---------------------------------------------------`);
  const costToDeploy = startingBalance.sub(
    await ethers.provider.getBalance((await ethers.getSigners())[0].address),
  );
  dim(`Final balance of deployer ${deployer}: ${ethers.utils.formatEther(costToDeploy)} ETH`);
  dim(`---------------------------------------------------`);
}
