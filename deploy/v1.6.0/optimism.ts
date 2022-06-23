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

export default async function deployToOptimism(hardhat: HardhatRuntimeEnvironment) {
  if (process.env.DEPLOY === 'v1.6.0.optimism') {
    dim(`Deploying: Receiver Chain Optimism Mainnet`)
    dim(`Version: 1.6.0`)
  } else { return }

  const { getNamedAccounts, ethers, getChainId } = hardhat

  const {
    deployer,
    executiveTeam,
    ptOperations,
    aUSDC,
    defenderRelayer,
    aaveIncentivesController,
    aaveLendingPoolAddressesProviderRegistry
  } = await getNamedAccounts()

  const chainId = parseInt(await getChainId(), 10)

  dim(`chainId ${chainId} `)
  dim(`---------------------------------------------------`)
  dim(`Named Accounts`)
  dim(`---------------------------------------------------`)
  dim(`deployer: ${deployer}`)
  dim(`executiveTeam: ${executiveTeam}`)
  dim(`ptOperations: ${ptOperations}`)
  dim(`defenderRelayer: ${defenderRelayer}`)
  dim(`aUSDC: ${aUSDC}`)
  dim(`aaveIncentivesController: ${aaveIncentivesController}`)
  dim(`aaveLendingPoolAddressesProviderRegistry: ${aaveLendingPoolAddressesProviderRegistry}`)
  dim(`---------------------------------------------------\n`)
  const startingBalance = await ethers.provider.getBalance((await ethers.getSigners())[0].address)

  // ===================================================
  // Deploy Contracts
  // ===================================================

  const aaveUsdcYieldSourceResult = await deployAndLog('AaveV3YieldSource', {
    from: deployer,
    args: [
      aUSDC,
      aaveIncentivesController,
      aaveLendingPoolAddressesProviderRegistry,
      "PTaOptUSDCY",
      "PoolTogether aOptUSDC Yield",
      TOKEN_DECIMALS,
      executiveTeam
    ]
  })
  const yieldSourcePrizePoolResult = await deployAndLog('YieldSourcePrizePool', { from: deployer, args: [deployer, aaveUsdcYieldSourceResult.address] })
  const ticketResult = await deployAndLog('Ticket', { from: deployer, args: ["PoolTogether aOptUSDC Ticket", "PTaOptUSDC", TOKEN_DECIMALS, yieldSourcePrizePoolResult.address] })
  const prizeTierHistoryResult = await deployAndLog('PrizeTierHistory', { from: deployer, args: [deployer] })
  const drawBufferResult = await deployAndLog('DrawBuffer', { from: deployer, args: [deployer, DRAW_BUFFER_CARDINALITY] })
  const prizeDistributionBufferResult = await deployAndLog('PrizeDistributionBuffer', { from: deployer, args: [deployer, PRIZE_DISTRIBUTION_BUFFER_CARDINALITY] })
  const drawCalculatorResult = await deployAndLog('DrawCalculator', { from: deployer, args: [ticketResult.address, drawBufferResult.address, prizeDistributionBufferResult.address] })
  const prizeDistributorResult = await deployAndLog('PrizeDistributor', { from: deployer, args: [executiveTeam, ticketResult.address, drawCalculatorResult.address] })
  const prizeSplitStrategyResult = await deployAndLog('PrizeSplitStrategy', { from: deployer, args: [deployer, yieldSourcePrizePoolResult.address] })
  const reserveResult = await deployAndLog('Reserve', { from: deployer, args: [deployer, ticketResult.address] })
  const drawCalculatorTimelockResult = await deployAndLog('DrawCalculatorTimelock', { from: deployer, args: [deployer, drawCalculatorResult.address] })
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
  const receiverTimelockTrigger = await deployAndLog('ReceiverTimelockTrigger', { from: deployer, args: [deployer, drawBufferResult.address, prizeDistributionFactoryResult.address, drawCalculatorTimelockResult.address]})

  await deployAndLog('TwabRewards', { from: deployer, args: [ticketResult.address], skipIfAlreadyDeployed: true });
  await deployAndLog('TWABDelegator', { from: deployer, args: ['PoolTogether Staked aOptUSDC Ticket', 'stkPTaOptUSDC', ticketResult.address], skipIfAlreadyDeployed: true });

  // ===================================================
  // Configure Contracts
  // ===================================================

  await initPrizeSplit()
  await setTicket(ticketResult.address)
  await setPrizeStrategy(prizeSplitStrategyResult.address)
  await setManager('ReceiverTimelockTrigger', null, defenderRelayer)
  await setManager('DrawBuffer', null, receiverTimelockTrigger.address)
  await setManager('PrizeFlush', null, defenderRelayer)
  await setManager('Reserve', null, prizeFlushResult.address)
  await setManager('DrawCalculatorTimelock', null, receiverTimelockTrigger.address)
  await setManager('PrizeDistributionFactory', null, receiverTimelockTrigger.address)
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
  await transferOwnership('ReceiverTimelockTrigger', null, executiveTeam)


  dim(`---------------------------------------------------`)
  const costToDeploy = startingBalance.sub(await ethers.provider.getBalance((await ethers.getSigners())[0].address))
  dim(`Final balance of deployer ${deployer}: ${ethers.utils.formatEther(costToDeploy)} ETH`)
  dim(`---------------------------------------------------`)
}
