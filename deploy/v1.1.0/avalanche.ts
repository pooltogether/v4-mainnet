import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import {
  DRAW_BUFFER_CARDINALITY,
  PRIZE_DISTRIBUTION_BUFFER_CARDINALITY,
  PRIZE_DISTRIBUTION_FACTORY_MINIMUM_PICK_COST,
  TOKEN_DECIMALS
} from '../../src/constants'
import { deployAndLog } from '../../src/deployAndLog'
import { setPrizeStrategy } from '../../src/setPrizeStrategy';
import { setTicket } from '../../src/setTicket';
import { transferOwnership } from '../../src/transferOwnership';
import { setManager } from '../../src/setManager';
import { initPrizeSplit } from '../../src/initPrizeSplit';
import { pushDraw48 } from '../../src/v1.1.0/pushDraw48';

export default async function deployToAvalanche(hardhat: HardhatRuntimeEnvironment) {
  if (process.env.DEPLOY === 'v1.1.0.avalanche') {
    dim(`Deploying: Receiver Chain Avalanche Mainnet`)
    dim(`Version: 1.1.0`)
  } else { return }

  const { getNamedAccounts } = hardhat

  // @ts-ignore
  const {
    deployer,
    executiveTeam,
    aUSDC,
    defenderRelayer,
    aaveIncentivesController,
    aaveLendingPoolAddressesProviderRegistry
  } = await getNamedAccounts()

  // ===================================================
  // Deploy Contracts
  // ===================================================

  const aaveUsdcYieldSourceResult = await deployAndLog('ATokenYieldSource', {
    from: deployer,
    args: [
      aUSDC,
      aaveIncentivesController,
      aaveLendingPoolAddressesProviderRegistry,
      TOKEN_DECIMALS,
      "PTaUSDCeY",
      "PoolTogether aUSDC Yield",
      executiveTeam
    ]
  })
  const yieldSourcePrizePoolResult = await deployAndLog('YieldSourcePrizePool', { from: deployer, args: [deployer, aaveUsdcYieldSourceResult.address] })
  const ticketResult = await deployAndLog('Ticket', { from: deployer, args: ["Ticket", "TICK", TOKEN_DECIMALS, yieldSourcePrizePoolResult.address] })
  const prizeTierHistoryResult = await deployAndLog('PrizeTierHistory', { from: deployer, args: [deployer] })
  const drawBufferResult = await deployAndLog('DrawBuffer', { from: deployer, args: [deployer, DRAW_BUFFER_CARDINALITY] })
  const prizeDistributionBufferResult = await deployAndLog('PrizeDistributionBuffer', { from: deployer, args: [deployer, PRIZE_DISTRIBUTION_BUFFER_CARDINALITY] })
  const drawCalculatorResult = await deployAndLog('DrawCalculator', { from: deployer, args: [ticketResult.address, drawBufferResult.address, prizeDistributionBufferResult.address] })
  const prizeDistributorResult = await deployAndLog('PrizeDistributor', { from: deployer, args: [executiveTeam, ticketResult.address, drawCalculatorResult.address] })
  const prizeSplitStrategyResult = await deployAndLog('PrizeSplitStrategy', { from: deployer, args: [deployer, yieldSourcePrizePoolResult.address] })
  const reserveResult = await deployAndLog('Reserve', { from: deployer, args: [deployer, ticketResult.address] })
  await deployAndLog('DrawCalculatorTimelock', { from: deployer, args: [deployer, drawCalculatorResult.address] })

  const prizeDistributionFactoryResult = await deployAndLog('PrizeDistributionFactory', {
    from: deployer,
    args: [
      deployer,
      prizeTierHistoryResult.address,
      drawBufferResult.address,
      prizeDistributionBufferResult.address,
      ticketResult.address,
      PRIZE_DISTRIBUTION_FACTORY_MINIMUM_PICK_COST // 1 USDC
    ]
  })
  await deployAndLog('EIP2612PermitAndDeposit', { from: deployer })
  const prizeFlushResult = await deployAndLog('PrizeFlush', { from: deployer, args: [deployer, prizeDistributorResult.address, prizeSplitStrategyResult.address, reserveResult.address]})
  const receiverTimelockAndPushRouterResult = await deployAndLog('ReceiverTimelockAndPushRouter', { from: deployer, args: [deployer, drawBufferResult.address, prizeDistributionFactoryResult.address, drawCalculatorResult.address]})

  // ===================================================
  // Configure Contracts
  // ===================================================

  await pushDraw48()
  await initPrizeSplit()
  await setTicket(ticketResult.address)
  await setPrizeStrategy(prizeSplitStrategyResult.address)
  await setManager('ReceiverTimelockAndPushRouter', null, defenderRelayer)
  await setManager('DrawBuffer', null, receiverTimelockAndPushRouterResult.address)
  await setManager('PrizeFlush', null, defenderRelayer)
  await setManager('Reserve', null, prizeFlushResult.address)
  await setManager('DrawCalculatorTimelock', null, receiverTimelockAndPushRouterResult.address)
  await setManager('PrizeDistributionFactory', null, receiverTimelockAndPushRouterResult.address)
  await setManager('PrizeDistributionBuffer', null, prizeDistributionFactoryResult.address)

  await transferOwnership('PrizeDistributionFactory', null, executiveTeam)
  await transferOwnership('DrawCalculatorTimelock', null, executiveTeam)
  await transferOwnership('PrizeFlush', null, executiveTeam)
  await transferOwnership('Reserve', null, executiveTeam)
  await transferOwnership('YieldSourcePrizePool', null, executiveTeam)
  await transferOwnership('PrizeTierHistory', null, executiveTeam)
  await transferOwnership('PrizeSplitStrategy', null, executiveTeam)
  await transferOwnership('DrawBuffer', null, executiveTeam)
  await transferOwnership('PrizeDistributionBuffer', null, executiveTeam)
}
