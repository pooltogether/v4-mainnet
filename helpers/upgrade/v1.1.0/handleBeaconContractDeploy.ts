import { deployContract } from '../../deployContract'

export interface handleBeaconContractDeployConfig {
  startingDrawId: string;
  startTimestamp: number;
  beaconPeriodSeconds: number;
  rngTimeoutSeconds: number;
}

export async function handleBeaconContractDeploy(deploy: Function, deployer: string, ethers: any, config: handleBeaconContractDeployConfig) {
  const prizeTierHistory = await ethers.getContract('PrizeTierHistory')
  const drawBuffer = await ethers.getContract('DrawBuffer')
  const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
  const ticket = await ethers.getContract('Ticket')
  const drawCalculatorTimelock = await ethers.getContract('DrawCalculatorTimelock')


  const prizeDistributionFactoryResult = await deployContract(deploy, 'PrizeDistributionFactory', deployer, [
    deployer,
    prizeTierHistory.address,
    drawBuffer.address,
    prizeDistributionBuffer.address,
    ticket.address,
    1000000 // 1 USDC
  ])

  const beaconTimelockAndPushRouterResult = await deployContract(deploy, 'BeaconTimelockAndPushRouter', deployer, [
    deployer,
    prizeDistributionFactoryResult.address,
    drawCalculatorTimelock.address
  ])

  return {
    prizeDistributionFactory: prizeDistributionFactoryResult,
    beaconTimelockAndPushRouter: beaconTimelockAndPushRouterResult
  }
}