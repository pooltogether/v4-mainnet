import { dim, cyan, green } from '../../src/colors';
import { deployAndLog } from '../../src/deployAndLog';
import { transferOwnership } from '../../src/transferOwnership';
import { setManager } from '../../src/setManager';
import {
  DRAW_BUFFER_CARDINALITY,
  PRIZE_DISTRIBUTION_BUFFER_CARDINALITY,
  BEACON_START_TIME,
  BEACON_PERIOD_SECONDS,
  END_TIMESTAMP_OFFSET,
  RNG_TIMEOUT_SECONDS,
  EXPIRY_DURATION,
  TOKEN_DECIMALS,
} from '../../src/constants';

const mainnetDeploy = async (hardhat) => {
  if (process.env.DEPLOY != 'mainnet') {
    dim(`Ignoring mainnet...`);
    return;
  } else {
    dim(`Deploying mainnet...`);
  }

  const { ethers, getChainId, getNamedAccounts } = hardhat;
  let {
    deployer,
    executiveTeam,
    defenderRelayer,
    ptOperations,
    aUSDC,
    aaveIncentivesController,
    aaveLendingPoolAddressesProviderRegistry,
    rngService,
  } = await getNamedAccounts();

  const chainId = parseInt(await getChainId(), 10);

  dim(`chainId ${chainId} `);
  dim(`---------------------------------------------------`);
  dim(`Named Accounts`);
  dim(`---------------------------------------------------`);
  dim(`deployer: ${deployer}`);
  dim(`executiveTeam: ${executiveTeam}`);
  dim(`ptOperations: ${ptOperations}`);
  dim(`defenderRelayer: ${defenderRelayer}`);
  dim(`aUSDC: ${aUSDC}`);
  dim(`aaveIncentivesController: ${aaveIncentivesController}`);
  dim(`aaveLendingPoolAddressesProviderRegistry: ${aaveLendingPoolAddressesProviderRegistry}`);
  dim(`---------------------------------------------------\n`);
  const startingBalance = await ethers.provider.getBalance((await ethers.getSigners())[0].address);

  /* ========================================= */
  // Phase 0 ---------------------------------
  // Test Contracts to easily test full functionality.
  /* ========================================= */

  const aaveUsdcYieldSourceResult = await deployAndLog('ATokenYieldSource', {
    from: deployer,
    args: [
      aUSDC,
      aaveIncentivesController,
      aaveLendingPoolAddressesProviderRegistry,
      TOKEN_DECIMALS,
      'PTaUSDCY',
      'PoolTogether aUSDC Yield',
      executiveTeam,
    ],
    skipIfAlreadyDeployed: true,
  });

  const yieldSourcePrizePoolResult = await deployAndLog('YieldSourcePrizePool', {
    from: deployer,
    args: [deployer, aaveUsdcYieldSourceResult.address],
    skipIfAlreadyDeployed: true,
  });

  /* ========================================= */
  // Phase 1 ---------------------------------
  // Setup Core Contracts
  /* ========================================= */
  const ticketResult = await deployAndLog('Ticket', {
    from: deployer,
    args: [
      'PoolTogether aUSDC Ticket',
      'PTaUSDC',
      TOKEN_DECIMALS,
      yieldSourcePrizePoolResult.address,
    ],
    skipIfAlreadyDeployed: true,
  });

  const prizeSplitStrategyResult = await deployAndLog('PrizeSplitStrategy', {
    from: deployer,
    args: [deployer, yieldSourcePrizePoolResult.address],
    skipIfAlreadyDeployed: true,
  });

  const yieldSourcePrizePool = await ethers.getContract('YieldSourcePrizePool');
  if ((await yieldSourcePrizePool.getTicket()) != ticketResult.address) {
    cyan('\nSetting ticket on prize pool...');
    const tx = await yieldSourcePrizePool.setTicket(ticketResult.address);
    await tx.wait(1);
    green(`\nSet ticket!`);
  }
  if ((await yieldSourcePrizePool.getPrizeStrategy()) != prizeSplitStrategyResult.address) {
    cyan('\nSetting prize strategy on prize pool...');
    const tx = await yieldSourcePrizePool.setPrizeStrategy(prizeSplitStrategyResult.address);
    await tx.wait(1);
    green(`Set prize strategy!`);
  }
  await transferOwnership('YieldSourcePrizePool', yieldSourcePrizePool, executiveTeam);

  const reserveResult = await deployAndLog('Reserve', {
    from: deployer,
    args: [deployer, ticketResult.address],
  });

  const prizeSplitStrategy = await ethers.getContract('PrizeSplitStrategy');
  if ((await prizeSplitStrategy.getPrizeSplits()).length == 0) {
    cyan('\nAdding 100% reserve prize split...');
    const tx = await prizeSplitStrategy.setPrizeSplits([
      { target: reserveResult.address, percentage: 1000 },
    ]);
    await tx.wait(1);
    green('Done!');
  }
  await transferOwnership('PrizeSplitStrategy', prizeSplitStrategy, executiveTeam);

  const drawBufferResult = await deployAndLog('DrawBuffer', {
    from: deployer,
    args: [deployer, DRAW_BUFFER_CARDINALITY],
    skipIfAlreadyDeployed: true,
  });

  const drawBeaconResult = await deployAndLog('DrawBeacon', {
    from: deployer,
    args: [
      ptOperations,
      drawBufferResult.address,
      rngService,
      1, // Starting DrawID
      BEACON_START_TIME,
      BEACON_PERIOD_SECONDS,
      RNG_TIMEOUT_SECONDS,
    ],
    skipIfAlreadyDeployed: true,
  });

  await deployAndLog('EIP2612PermitAndDeposit', { from: deployer, skipIfAlreadyDeployed: true });

  const drawBuffer = await ethers.getContract('DrawBuffer');
  await setManager('DrawBuffer', drawBuffer, drawBeaconResult.address);
  await transferOwnership('DrawBuffer', drawBuffer, ptOperations);

  const prizeDistributionBufferResult = await deployAndLog('PrizeDistributionBuffer', {
    from: deployer,
    args: [deployer, PRIZE_DISTRIBUTION_BUFFER_CARDINALITY],
    skipIfAlreadyDeployed: true,
  });

  const drawCalculatorResult = await deployAndLog('DrawCalculator', {
    from: deployer,
    args: [ticketResult.address, drawBufferResult.address, prizeDistributionBufferResult.address],
    skipIfAlreadyDeployed: true,
  });

  const drawCalculatorTimelockResult = await deployAndLog('DrawCalculatorTimelock', {
    from: deployer,
    args: [deployer, drawCalculatorResult.address],
    skipIfAlreadyDeployed: true,
  });

  const prizeDistributorResult = await deployAndLog('PrizeDistributor', {
    from: deployer,
    args: [executiveTeam, ticketResult.address, drawCalculatorTimelockResult.address],
    skipIfAlreadyDeployed: true,
  });

  const prizeFlushResult = await deployAndLog('PrizeFlush', {
    from: deployer,
    args: [
      deployer,
      prizeDistributorResult.address,
      prizeSplitStrategyResult.address,
      reserveResult.address,
    ],
  });

  const prizeFlush = await ethers.getContract('PrizeFlush');
  await setManager('PrizeFlush', prizeFlush, defenderRelayer);
  await transferOwnership('PrizeFlush', prizeFlush, ptOperations);

  const reserve = await ethers.getContract('Reserve');
  await setManager('Reserve', reserve, prizeFlushResult.address);
  await transferOwnership('Reserve', reserve, executiveTeam);

  /* ========================================= */
  // Phase 2 ---------------------------------
  // Setup the Timelock contracts
  /* ========================================= */

  const L1TimelockTriggerResult = await deployAndLog('L1TimelockTrigger', {
    from: deployer,
    args: [deployer, prizeDistributionBufferResult.address, drawCalculatorTimelockResult.address],
    skipIfAlreadyDeployed: true,
  });

  /* ========================================= */
  // Phase 3 ---------------------------------
  // Set the manager(s) of the periphery smart contracts.
  /* ========================================= */

  const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer');
  await setManager(
    'PrizeDistributionBuffer',
    prizeDistributionBuffer,
    L1TimelockTriggerResult.address,
  );
  await transferOwnership('PrizeDistributionBuffer', prizeDistributionBuffer, ptOperations);

  const drawCalculatorTimelock = await ethers.getContract('DrawCalculatorTimelock');
  await setManager(
    'DrawCalculatorTimelock',
    drawCalculatorTimelock,
    L1TimelockTriggerResult.address,
  );
  await transferOwnership('DrawCalculatorTimelock', drawCalculatorTimelock, ptOperations);

  const l1TimelockTrigger = await ethers.getContract('L1TimelockTrigger');
  await setManager('L1TimelockTrigger', l1TimelockTrigger, defenderRelayer);
  await transferOwnership('L1TimelockTrigger', l1TimelockTrigger, ptOperations);

  // Phase 4 ---------------------------------
  await deployAndLog('PrizeTierHistory', {
    from: deployer,
    args: [deployer],
    skipIfAlreadyDeployed: true,
  });

  const prizeTierHistory = await ethers.getContract('PrizeTierHistory');
  if ((await prizeTierHistory.count()) == 0) {
    cyan(`\nSetting draw 1 prize tier history...`);
    const pushTx = await prizeTierHistory.push({
      drawId: 1,
      bitRangeSize: 2,
      maxPicksPerUser: 2,
      endTimestampOffset: END_TIMESTAMP_OFFSET,
      prize: '14980000000',
      tiers: ['166889185', 0, 0, '320427236', 0, '512683578', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      expiryDuration: EXPIRY_DURATION,
    });
    await pushTx.wait(1);
    green(`Prize tiers for draw 1 set!`);
  }
  await transferOwnership('PrizeTierHistory', prizeTierHistory, ptOperations);

  dim(`---------------------------------------------------`);
  const costToDeploy = startingBalance.sub(
    await ethers.provider.getBalance((await ethers.getSigners())[0].address),
  );
  dim(`Final balance of deployer ${deployer}: ${ethers.utils.formatEther(costToDeploy)} ETH`);
  dim(`---------------------------------------------------`);
};

export default mainnetDeploy;
