import { deployContract } from '../../deployContract'

export async function handleReceiverContractDeploy(deploy: Function, deployer: string, ethers: any) {
  // const prizeTierHistory = await ethers.getContract('PrizeTierHistory')
  const prizeTierHistory = await deployContract(deploy, 'PrizeTierHistory', deployer, [deployer])
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
    1000000 // @NOTE:  1 USDC = 1000000 wei = Minumum ticket cost
  ])
  const receiverTimelockAndPushRouterResult = await deployContract(deploy, 'ReceiverTimelockAndPushRouter', deployer, [
    deployer,
    drawBuffer.address,
    prizeDistributionFactoryResult.address,
    drawCalculatorTimelock.address
  ])

  return {
    prizeDistributionFactory: prizeDistributionFactoryResult,
    receiverTimelockAndPushRouterResult: receiverTimelockAndPushRouterResult
  }
}