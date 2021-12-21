import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { deployAndLog } from '../../src/deployAndLog';
import { PRIZE_DISTRIBUTION_FACTORY_MINIMUM_PICK_COST } from '../../src/constants';
import { pushDraw48 } from '../../src/v1.1.0/pushDraw48';
import { setManager } from '../../src/setManager';
import { transferOwnership } from '../../src/transferOwnership';

export default async function upgradePolygon(hardhat: HardhatRuntimeEnvironment) {
  if (process.env.DEPLOY === 'v1.1.0.polygon') {
    dim(`Deploying: Receiver Chain Polygon Mainnet`)
    dim(`Version: 1.0.1 to 1.1.0`)
  } else { return }
  // @ts-ignore
  const { ethers, getNamedAccounts } = hardhat
  const {
    deployer,
    executiveTeam,
    defenderRelayer
  } = await getNamedAccounts();

  const drawBuffer = await ethers.getContract('DrawBuffer')
  const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
  const ticket = await ethers.getContract('Ticket')
  const drawCalculatorTimelock = await ethers.getContract('DrawCalculatorTimelock')
  
  // ===================================================
  // Deploy Contracts
  // ===================================================
  const prizeTierHistory = await deployAndLog('PrizeTierHistory', {
    from: deployer,
    args: [deployer]
  })
  
  const prizeDistributionFactoryResult = await deployAndLog('PrizeDistributionFactory', {
    from: deployer,
    args: [
      deployer,
      prizeTierHistory.address,
      drawBuffer.address,
      prizeDistributionBuffer.address,
      ticket.address,
      PRIZE_DISTRIBUTION_FACTORY_MINIMUM_PICK_COST // @NOTE:  1 USDC = 1000000 wei = Minimum ticket cost
    ]
  })
  const receiverTimelockTrigger = await deployAndLog('ReceiverTimelockTrigger', {
    from: deployer,
    args: [
      deployer,
      drawBuffer.address,
      prizeDistributionFactoryResult.address,
      drawCalculatorTimelock.address
    ]
  })

  // ===================================================
  // Configure Contracts
  // ===================================================
  await pushDraw48()
  await setManager('ReceiverTimelockTrigger', null, defenderRelayer)
  await setManager('PrizeDistributionFactory', null, receiverTimelockTrigger.address)
  await transferOwnership('PrizeDistributionFactory', null, executiveTeam)
  await transferOwnership('ReceiverTimelockTrigger', null, executiveTeam)
  await transferOwnership('PrizeTierHistory', null, executiveTeam)
}
