import { deployContract } from './deployContract'

export async function handleReceiverChainContractDeploy(deploy: Function, deployer: string, ethers: any) {
  const drawBuffer = await ethers.getContract('DrawBuffer')
  const prizeDistributionFactory = await ethers.getContract('PrizeDistributionFactory')
  const drawCalculator = await ethers.getContract('DrawCalculatorTimelock')
  await deployContract(deploy, 'ReceiverTimelockAndPushRouter', deployer, [deployer, drawBuffer.address, prizeDistributionFactory.address, drawCalculator.address])
}

export default handleReceiverChainContractDeploy