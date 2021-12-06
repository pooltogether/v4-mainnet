
import { cyan, green } from "chalk";

export async function configureReceiverChainDeployment(ethers: any, manager: string) {
  const receiverTimelockAndPushRouter = await ethers.getContract('ReceiverTimelockAndPushRouter')
  const drawBuffer = await ethers.getContract('DrawBuffer')
  const drawCalculatorTimelock = await ethers.getContract('DrawCalculatorTimelock')
  const prizeDistributionFactory = await ethers.getContract('PrizeDistributionFactory')
  const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
  const prizeTierHistory = await ethers.getContract('PrizeTierHistory')

  /**
   * Set Initial PrizeTierHistory
   */

  let pthDrawId = 0;
  try {
    pthDrawId = await prizeTierHistory.getNewestDrawId()
  } catch (error) {
    console.log('PrizeTierHistory: No PrizeTiers')
  }

  if (pthDrawId === 0) {
    const nextPrizeTier = {
      bitRangeSize: 2,
      drawId: 1,
      maxPicksPerUser: 2,
      expiryDuration: 5184000,
      endTimestampOffset: 900,
      prize: 15000000000,
      tiers: [166889185, 0, 0, 320427236, 0, 512683578, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    }
    console.log(cyan('\nSetting PrizeTierHistory first PrizeTier'))
    await prizeTierHistory.push(nextPrizeTier)
  } else {
    const prizeD = await prizeDistributionFactory.calculatePrizeDistribution(1, '10000000')
    prizeD
    console.log("calculatePrizeDistribution: ", prizeD)
  }

  /**
   * MockYieldSource Configuration
   * Sets the mock YieldSource.ticket to the MintableToken contract.
   */
  const yieldSourcePrizePool = await ethers.getContract('YieldSourcePrizePool')
  const ticket = await ethers.getContract('Ticket')
  if (await yieldSourcePrizePool.getTicket() != ticket.address) {
    console.log(console.log(cyan('\nSetting ticket on prize pool...')))
    const tx = await yieldSourcePrizePool.setTicket(ticket.address)
    await tx.wait(1)
    console.log(green(`\nSet ticket!`))
  }

  /**
   * Management Hierarchy
   * --------------------
   * Defender Autotask                 (EOA)
   * ReceiverTimelockAndPushRouter     (Manager => Defender Autotask)
   *   DrawBuffer                      (Manager => ReceiverTimelockAndPushRouter)
   *   DrawCalculatorTimelock          (Manager => ReceiverTimelockAndPushRouter)
   *   PrizeDistributionFactory        (Manager => ReceiverTimelockAndPushRouter)
   *     PrizeDistributionBuffer       (Manager => PrizeDistributionFactory)
   */

  /**
   * @dev The ReceiverTimelockAndPushRouter contract will be managed by a Defender Autotask
   */
  if (await receiverTimelockAndPushRouter.manager() != manager) {
    console.log(console.log(cyan(`\nSetting ReceiverTimelockAndPushRouter manager to ${manager}`)))
    const tx = await receiverTimelockAndPushRouter.setManager(manager)
    await tx.wait(1)
    console.log(green('Done!'))
  }

  /**
   * @dev The DrawBuffer contract will be managed by ReceiverTimelockAndPushRouter
   */
  if (await drawBuffer.manager() != receiverTimelockAndPushRouter.address) {
    console.log(cyan(`\nSetting DrawBuffer manager to ${receiverTimelockAndPushRouter.address}`))
    const tx = await drawBuffer.setManager(receiverTimelockAndPushRouter.address)
    await tx.wait(1)
    console.log(green('Done!'))
  }

  /**
   * @dev The DrawCalculatorTimelock contract will be managed by ReceiverTimelockAndPushRouter
   */
  if (await drawCalculatorTimelock.manager() != receiverTimelockAndPushRouter.address) {
    console.log(cyan(`\nSetting DrawCalculatorTimelock manager to ${receiverTimelockAndPushRouter.address}`))
    const tx = await drawCalculatorTimelock.setManager(receiverTimelockAndPushRouter.address)
    await tx.wait(1)
    console.log(green('Done!'))
  }

  /**
   * @dev The PrizeDistributionFactory contract will be managed by ReceiverTimelockAndPushRouter
   */
  if (await prizeDistributionFactory.manager() != receiverTimelockAndPushRouter.address) {
    console.log(cyan(`\nSetting PrizeDistributionFactory manager to ${receiverTimelockAndPushRouter.address}`))
    const tx = await prizeDistributionFactory.setManager(receiverTimelockAndPushRouter.address)
    await tx.wait(1)
    console.log(green('Done!'))
  }

  /**
   * @dev The PrizeDistributionBuffer contract will be managed by PrizeDistributionFactory
   */
  if (await prizeDistributionBuffer.manager() != prizeDistributionFactory.address) {
    console.log(cyan(`\nSetting PrizeDistributionBuffer manager to ${prizeDistributionFactory.address}`))
    const tx = await prizeDistributionBuffer.setManager(prizeDistributionFactory.address)
    await tx.wait(1)
    console.log(green('Done!'))
  }

}

export default configureReceiverChainDeployment