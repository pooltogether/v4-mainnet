const { dim, cyan, green } = require('../src/colors')
const { deployAndLog } = require('../src/deployAndLog')
const { transferOwnership } = require('../src/transferOwnership')
const { setManager } = require('../src/setManager')
const { 
  DRAW_BUFFER_CARDINALITY,
  PRIZE_DISTRIBUTION_BUFFER_CARDINALITY,
  TOKEN_DECIMALS
} = require('../src/constants')

module.exports = async (hardhat) => {
 
  if (process.env.DEPLOY != 'polygon') {
    dim(`Ignoring polygon...`)
    return
  } else {
    dim(`Deploying polygon...`)
  }

  const {
    ethers,
    getChainId,
    getNamedAccounts
  } = hardhat
  let {
    deployer,
    executiveTeam,
    defenderRelayer,
    ptOperations,
    aUSDC,
    aaveIncentivesController,
    aaveLendingPoolAddressesProviderRegistry
  } = await getNamedAccounts();

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
  dim(`---------------------------------------------------`)

  const aaveUsdcYieldSourceResult = await deployAndLog(
    'ATokenYieldSource', 
    {
      from: deployer,
      args: [
        aUSDC,
        aaveIncentivesController,
        aaveLendingPoolAddressesProviderRegistry,
        TOKEN_DECIMALS,
        "PTaUSDCY",
        "PoolTogether aUSDC Yield",
        executiveTeam
      ],
      skipIfAlreadyDeployed: true
    }
  )

  const yieldSourcePrizePoolResult = await deployAndLog(
    'YieldSourcePrizePool',
    {
      from: deployer,
      args: [
        deployer,
        aaveUsdcYieldSourceResult.address
      ]
    }
  )

  const ticketResult = await deployAndLog(
    'Ticket', 
    {
      from: deployer,
      args: [
        "PoolTogether aUSDC Ticket",
        "PTaUSDC",
        TOKEN_DECIMALS,
        yieldSourcePrizePoolResult.address
      ],
      skipIfAlreadyDeployed: true
    }
  )
  
  const prizeSplitStrategyResult = await deployAndLog(
    'PrizeSplitStrategy',
    {
      from: deployer,
      args: [
        deployer,
        yieldSourcePrizePoolResult.address
      ]
    }
  )
  
  const yieldSourcePrizePool = await ethers.getContract('YieldSourcePrizePool')
  if (await yieldSourcePrizePool.getTicket() != ticketResult.address) {
    cyan('\nSetting ticket on prize pool...')
    const tx = await yieldSourcePrizePool.setTicket(ticketResult.address)
    await tx.wait(1)
    green(`\nSet ticket!`)
  }
  if (await yieldSourcePrizePool.getPrizeStrategy() != prizeSplitStrategyResult.address) {
    cyan('\nSetting prize strategy on prize pool...')
    const tx = await yieldSourcePrizePool.setPrizeStrategy(prizeSplitStrategyResult.address)
    await tx.wait(1)
    green(`Set prize strategy!`)
  }
  await transferOwnership('YieldSourcePrizePool', yieldSourcePrizePool, executiveTeam)


  const drawBufferResult = await deployAndLog(
    'DrawBuffer',
    {
      from: deployer,
      args: [
        deployer,
        DRAW_BUFFER_CARDINALITY
      ]
    }
  )

  const prizeDistributionBufferResult = await deployAndLog(
    'PrizeDistributionBuffer',
    {
      from: deployer,
      args: [
        deployer,
        PRIZE_DISTRIBUTION_BUFFER_CARDINALITY
      ]
    }
  )

  const drawCalculatorResult = await deployAndLog(
    'DrawCalculator',
    {
      from: deployer,
      args: [
        ticketResult.address,
        drawBufferResult.address,
        prizeDistributionBufferResult.address
      ]
    }
  )

  const drawCalculatorTimelockResult = await deployAndLog(
    'DrawCalculatorTimelock',
    {
      from: deployer,
      args: [
        deployer,
        drawCalculatorResult.address
      ]
    }
  )

  const prizeDistributorResult = await deployAndLog(
    'PrizeDistributor',
    {
      from: deployer,
      args: [
        executiveTeam,
        ticketResult.address,
        drawCalculatorTimelockResult.address
      ]
    }
  )
  
  const reserveResult = await deployAndLog(
    'Reserve',
    {
      from: deployer,
      args: [
        deployer,
        ticketResult.address
      ]
    }
  )
  
  const prizeSplitStrategy = await ethers.getContract('PrizeSplitStrategy')
  if ((await prizeSplitStrategy.getPrizeSplits()).length == 0) {
    cyan('\n adding split...')
    const tx = await prizeSplitStrategy.setPrizeSplits([
      { target: reserveResult.address, percentage: 1000 }
    ])
    await tx.wait(1)
    green('Done!')
  }
  await transferOwnership('PrizeSplitStrategy', prizeSplitStrategy, executiveTeam)

  const prizeFlushResult = await deployAndLog(
    'PrizeFlush',
    {
      from: deployer,
      args: [
        deployer,
        prizeDistributorResult.address,
        prizeSplitStrategyResult.address,
        reserveResult.address
      ]
    }
  )

  await deployAndLog(
    'L2TimelockTrigger',
    {
      from: deployer,
      args: [
        deployer,
        drawBufferResult.address,
        prizeDistributionBufferResult.address,
        drawCalculatorTimelockResult.address
      ]
    }
  )
  
  /* ========================================= */
  // Phase 3 ---------------------------------
  // Set the manager(s) of the periphery smart contracts.
  /* ========================================= */
  
  const prizeFlush = await ethers.getContract('PrizeFlush')
  await setManager('PrizeFlush', prizeFlush, defenderRelayer)
  await transferOwnership('PrizeFlush', prizeFlush, ptOperations)
  
  const reserve = await ethers.getContract('Reserve')
  await setManager('Reserve', reserve, prizeFlushResult.address)
  await transferOwnership('Reserve', reserve, executiveTeam)
  
  const l2TimelockTrigger = await ethers.getContract('L2TimelockTrigger')
  await setManager('L2TimelockTrigger', l2TimelockTrigger, defenderRelayer)
  await transferOwnership('L2TimelockTrigger', l2TimelockTrigger, ptOperations)
  
  const drawBuffer = await ethers.getContract('DrawBuffer')
  await setManager('DrawBuffer', drawBuffer, l2TimelockTrigger.address)
  await transferOwnership('DrawBuffer', drawBuffer, ptOperations)
  
  const drawCalculatorTimelock = await ethers.getContract('DrawCalculatorTimelock')
  await setManager('DrawCalculatorTimelock', drawCalculatorTimelock, l2TimelockTrigger.address)
  await transferOwnership('DrawCalculatorTimelock', drawCalculatorTimelock, ptOperations)

  const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
  await setManager('PrizeDistributionBuffer', prizeDistributionBuffer, l2TimelockTrigger.address)
  await transferOwnership('PrizeDistributionBuffer', prizeDistributionBuffer, ptOperations)

}
