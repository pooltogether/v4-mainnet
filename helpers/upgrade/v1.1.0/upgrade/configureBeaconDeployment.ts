import { PopulatedTransaction } from "ethers"

export async function configureBeaconDeployment(ethers: any) {
  const beaconTimelockAndPushRouter = await ethers.getContract('BeaconTimelockAndPushRouter')
  const drawCalculatorTimelock = await ethers.getContract('DrawCalculatorTimelock')
  const prizeDistributionFactory = await ethers.getContract('PrizeDistributionFactory')
  const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
  const populatedTransactions: PopulatedTransaction[] = []

  /**
   * Timelock Management Hierarchy
   * -----------------------------
   * Defender Autotask               (EOA)
   * BeaconTimelockAndPushRouter     (Manager => Defender Autotask) @NOTE Correct manager set during deployment
   *   DrawCalculatorTimelock        (Manager => BeaconTimelockAndPushRouter)
   *   PrizeDistributionFactory      (Manager => BeaconTimelockAndPushRouter) @NOTE Correct manager set during deployment
   *     PrizeDistributionBuffer     (Manager => PrizeDistributionFactory)
   */
  const txToSetDrawCalculatorTimelockManager = await drawCalculatorTimelock.populateTransaction.setManager(beaconTimelockAndPushRouter.address)
  const txToSetPrizeDistributionBufferManager = await prizeDistributionBuffer.populateTransaction.setManager(prizeDistributionFactory.address)
  populatedTransactions.push(txToSetDrawCalculatorTimelockManager)
  populatedTransactions.push(txToSetPrizeDistributionBufferManager)
  return populatedTransactions
}

export default configureBeaconDeployment