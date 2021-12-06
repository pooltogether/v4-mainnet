import { deployContract } from './deployContract'

export async function handlePeripheryContractDeploy(deploy: Function, deployer: string, ethers: any) {
  const prizeDistributor = await ethers.getContract('PrizeDistributor')
  const prizeSplitStrategy = await ethers.getContract('PrizeSplitStrategy')
  const reserve = await ethers.getContract('Reserve')

  const EIP2612PermitAndDepositResult = await deployContract(deploy, 'EIP2612PermitAndDeposit', deployer, [])
  const prizeFlushResult = await deployContract(deploy, 'PrizeFlush', deployer, [deployer, prizeDistributor.address, prizeSplitStrategy.address, reserve.address])

  return {
    prizeFlushResult: prizeFlushResult,
    EIP2612PermitAndDeposit: EIP2612PermitAndDepositResult
  }
}

export default handlePeripheryContractDeploy