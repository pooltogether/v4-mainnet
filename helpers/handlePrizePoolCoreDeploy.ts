import { deployContract } from './deployContract'
import {
  TOKEN_DECIMALS
} from '../src/constants';
export interface handlePrizePoolCoreDeployConfig {
  decimals: number | string,
  drawDufferCardinality: number | string,
  prizeDistributionBufferCardinality: number | string,
}

export async function handlePrizePoolCoreDeploy(
  deploy: Function,
  deployer: string,
  ethers: any,
  getNamedAccounts: Function,
  decimals: number | string,
  drawDufferCardinality: number | string,
  prizeDistributionBufferCardinality: number | string,
) {

  let {
    executiveTeam,
    aUSDC,
    aaveIncentivesController,
    aaveLendingPoolAddressesProviderRegistry,
  } = await getNamedAccounts();
  const yieldSourcePrizePool = await deployContract(deploy, 'ATokenYieldSource', deployer, [
    aUSDC,
    aaveIncentivesController,
    aaveLendingPoolAddressesProviderRegistry,
    TOKEN_DECIMALS,
    "PTaUSDCY",
    "PoolTogether aUSDC Yield",
    executiveTeam
  ])
  const ticketResult = await deployContract(deploy, 'Ticket', deployer, ["Ticket", "TICK", decimals, yieldSourcePrizePool.address])
  const prizeTierHistoryResult = await deployContract(deploy, 'PrizeTierHistory', deployer, [executiveTeam])
  const drawBufferResult = await deployContract(deploy, 'DrawBuffer', deployer, [executiveTeam, drawDufferCardinality])
  const prizeDistributionBufferResult = await deployContract(deploy, 'PrizeDistributionBuffer', deployer, [executiveTeam, prizeDistributionBufferCardinality])
  const drawCalculatorResult = await deployContract(deploy, 'DrawCalculator', deployer, [ticketResult.address, drawBufferResult.address, prizeDistributionBufferResult.address])
  const prizeDistributorResult = await deployContract(deploy, 'PrizeDistributor', deployer, [executiveTeam, ticketResult.address, drawCalculatorResult.address])
  const prizeSplitStrategyResult = await deployContract(deploy, 'PrizeSplitStrategy', deployer, [executiveTeam, yieldSourcePrizePool.address])
  const reserveResult = await deployContract(deploy, 'Reserve', deployer, [executiveTeam, ticketResult.address])
  const prizeSplitStrategy = await ethers.getContract('PrizeSplitStrategy')
  const drawCalculatorTimelockResult = await deployContract(deploy, 'DrawCalculatorTimelock', deployer, [executiveTeam, drawCalculatorResult.address])
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