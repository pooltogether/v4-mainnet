import { PopulatedTransaction } from "ethers"

export async function configureReceiverDeployment(ethers: any) {
  const receiverTimelockAndPushRouter = await ethers.getContract('ReceiverTimelockAndPushRouter')
  const drawCalculatorTimelock = await ethers.getContract('DrawCalculatorTimelock')
  const prizeDistributionFactory = await ethers.getContract('PrizeDistributionFactory')
  const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
  const populatedTransactions: PopulatedTransaction[] = []

  /**
   * Timelock Management Hierarchy
   * -----------------------------
   * Defender Autotask               (EOA)
   * ReceiverTimelockAndPushRouter   (Manager => Defender Autotask) @NOTE Correct manager set during deployment
   *   DrawCalculatorTimelock        (Manager => ReceiverTimelockAndPushRouter)
   *   PrizeDistributionFactory      (Manager => ReceiverTimelockAndPushRouter) @NOTE Correct manager set during deployment
   *     PrizeDistributionBuffer     (Manager => PrizeDistributionFactory)
   */
  const txToSetDrawCalculatorTimelockManager = await drawCalculatorTimelock.populateTransaction.setManager(receiverTimelockAndPushRouter.address)
  const txToSetPrizeDistributionBufferManager = await prizeDistributionBuffer.populateTransaction.setManager(prizeDistributionFactory.address)
  populatedTransactions.push(txToSetDrawCalculatorTimelockManager)
  populatedTransactions.push(txToSetPrizeDistributionBufferManager)
  return populatedTransactions
}

export default configureReceiverDeployment