import { cyan, green } from "chalk"

export async function configureBeaconChainDeployment(ethers: any, manager: string) {
  const drawBeacon = await ethers.getContract('DrawBeacon')
  const drawBuffer = await ethers.getContract('DrawBuffer')
  const beaconTimelockAndPushRouter = await ethers.getContract('BeaconTimelockAndPushRouter')
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
    const nextPrizeTier = undefined;
    // @TODO: Best way to set initial PrizeTierHistory? 
    if (nextPrizeTier) {
      console.log(cyan('\nSetting PrizeTierHistory first PrizeTier'))
      await prizeTierHistory.push(nextPrizeTier)
    }
  } else { }

  /**
   * YieldSource Hierarchy
   * ---------------------
   * YieldSourcePrizePool   (SmartContract)
   *   Ticket               (Minter => YieldSourcePrizePool)
   */
  const yieldSourcePrizePool = await ethers.getContract('YieldSourcePrizePool')
  const ticket = await ethers.getContract('Ticket')
  if (await yieldSourcePrizePool.getTicket() != ticket.address) {
    console.log(cyan('\nSetting ticket on prize pool...'))
    const tx = await yieldSourcePrizePool.setTicket(ticket.address)
    await tx.wait(1)
    console.log(green(`\nSet ticket!`))
  }

  /**
   * BeaconChain Management Hierarchy
   * -------------------------------
   * DrawBeacon   (SmartContract)
   *   DrawBuffer (Manager => DrawBeacon)
   */
  if (await drawBuffer.manager() != drawBeacon.address) {
    console.log(cyan(`\nSetting DrawBuffer manager to ${drawBeacon.address}`))
    const tx = await drawBuffer.setManager(drawBeacon.address)
    await tx.wait(1)
    console.log(green('Done!'))
  }

  /**
   * Timelock Management Hierarchy
   * -----------------------------
   * Defender Autotask               (EOA)
   * BeaconTimelockAndPushRouter     (Manager => Defender Autotask)
   *   DrawCalculatorTimelock        (Manager => BeaconTimelockAndPushRouter)
   *   PrizeDistributionFactory      (Manager => BeaconTimelockAndPushRouter)
   *     PrizeDistributionBuffer     (Manager => PrizeDistributionFactory)
   */

  /**
   * @dev The BeaconTimelockAndPushRouter contract will be managed by a Defender Autotask
   */
  if (await beaconTimelockAndPushRouter.manager() != manager) {
    console.log(cyan(`\nSetting BeaconTimelockAndPushRouter manager to ${manager}...`))
    const tx = await beaconTimelockAndPushRouter.setManager(manager)
    await tx.wait(1)
    console.log(green('Done!'))
  }

  /**
   * @dev The DrawCalculatorTimelock contract will be managed by BeaconTimelockAndPushRouter
   */
  if (await drawCalculatorTimelock.manager() != beaconTimelockAndPushRouter.address) {
    console.log(cyan(`\nSetting DrawCalculatorTimelock manager to ${beaconTimelockAndPushRouter.address}`))
    const tx = await drawCalculatorTimelock.setManager(beaconTimelockAndPushRouter.address)
    await tx.wait(1)
    console.log(green('Done!'))
  }

  /**
   * @dev The PrizeDistributionFactory contract will be managed by BeaconTimelockAndPushRouter
   */
  if (await prizeDistributionFactory.manager() != beaconTimelockAndPushRouter.address) {
    console.log(cyan(`\nSetting PrizeDistributionFactory manager to ${beaconTimelockAndPushRouter.address}`))
    const tx = await prizeDistributionFactory.setManager(beaconTimelockAndPushRouter.address)
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

export default configureBeaconChainDeployment