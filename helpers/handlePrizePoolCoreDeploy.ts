import { deployContract } from './deployContract'

export interface handlePrizePoolCoreDeployConfig {
  decimals: number | string,
  drawDufferCardinality: number | string,
  prizeDistributionBufferCardinality: number | string,
}

export async function handlePrizePoolCoreDeploy(
  deploy: Function,
  deployer: string,
  ethers: any,
  decimals: number | string,
  drawDufferCardinality: number | string,
  prizeDistributionBufferCardinality: number | string,
) {
  const yieldSourcePrizePool = await ethers.getContract('YieldSourcePrizePool')
  const ticketResult = await deployContract(deploy, 'Ticket', deployer, ["Ticket", "TICK", decimals, yieldSourcePrizePool.address])
  const prizeTierHistoryResult = await deployContract(deploy, 'PrizeTierHistory', deployer, [deployer])
  const drawBufferResult = await deployContract(deploy, 'DrawBuffer', deployer, [deployer, drawDufferCardinality])
  const prizeDistributionBufferResult = await deployContract(deploy, 'PrizeDistributionBuffer', deployer, [deployer, prizeDistributionBufferCardinality])
  const drawCalculatorResult = await deployContract(deploy, 'DrawCalculator', deployer, [ticketResult.address, drawBufferResult.address, prizeDistributionBufferResult.address])
  const prizeDistributorResult = await deployContract(deploy, 'PrizeDistributor', deployer, [deployer, ticketResult.address, drawCalculatorResult.address])
  const prizeSplitStrategyResult = await deployContract(deploy, 'PrizeSplitStrategy', deployer, [deployer, yieldSourcePrizePool.address])
  const reserveResult = await deployContract(deploy, 'Reserve', deployer, [deployer, ticketResult.address])
  const prizeSplitStrategy = await ethers.getContract('PrizeSplitStrategy')
  const drawCalculatorTimelockResult = await deployContract(deploy, 'DrawCalculatorTimelock', deployer, [deployer, drawCalculatorResult.address])
  const prizeDistributionFactoryResult = await deployContract(deploy, 'PrizeDistributionFactory', deployer, [
    deployer,
    prizeTierHistoryResult.address,
    drawBufferResult.address,
    prizeDistributionBufferResult.address,
    ticketResult.address,
    1000000 // 1 USDC @TODO: remove hardcoded value
  ])

  return {
    drawBufferResult,
    prizeDistributionBufferResult,
    drawCalculatorResult,
    prizeDistributorResult,
    reserveResult,
    ticketResult,
    prizeSplitStrategyResult,
    prizeSplitStrategy,
    drawCalculatorTimelockResult,
    prizeDistributionFactoryResult
  }
}

export default handlePrizePoolCoreDeploy