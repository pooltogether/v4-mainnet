import hre from "hardhat";
import { deployContract } from '../../../deployContract'

export async function handleBeaconContractDeploy(deploy: Function, deployer: string, ethers: any) {
  const prizeTierHistory = await ethers.getContract('PrizeTierHistory')
  const drawBuffer = await ethers.getContract('DrawBuffer')
  const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
  const ticket = await ethers.getContract('Ticket')
  const drawCalculatorTimelock = await ethers.getContract('DrawCalculatorTimelock')

  const { ptOperations } = await hre.getNamedAccounts()
  
  const prizeDistributionFactoryResult = await deployContract(deploy, 'PrizeDistributionFactory', deployer, [
    ptOperations,
    prizeTierHistory.address,
    drawBuffer.address,
    prizeDistributionBuffer.address,
    ticket.address,
    1000000 // @NOTE:  1 USDC = 1000000 wei = Minumum ticket cost
  ])

  const beaconTimelockAndPushRouterResult = await deployContract(deploy, 'BeaconTimelockAndPushRouter', deployer, [
    ptOperations,
    prizeDistributionFactoryResult.address,
    drawCalculatorTimelock.address
  ])

  return {
    prizeDistributionFactory: prizeDistributionFactoryResult,
    beaconTimelockAndPushRouter: beaconTimelockAndPushRouterResult
  }
}
