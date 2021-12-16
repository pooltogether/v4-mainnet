import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { deployAndLog } from '../../src/deployAndLog';
import { PRIZE_DISTRIBUTION_FACTORY_MINIMUM_PICK_COST } from '../../src/constants';
import { setManager } from '../../src/setManager';
import { transferOwnership } from '../../src/transferOwnership';

const upgradeBeaconEthereumMainnet = async (hardhat: HardhatRuntimeEnvironment) => {
  if (process.env.DEPLOY === 'v1.1.0.mainnet') {
    dim(`Deploying: Beacon Chain Ethereum Mainnet`)
    dim(`Version: 1.0.1 to 1.1.0`)
  } else { return }

  const { ethers, getNamedAccounts } = hardhat
  
  const {
    deployer,
    defenderRelayer,
    executiveTeam
  } = await getNamedAccounts()

  const prizeTierHistory = await ethers.getContract('PrizeTierHistory')
  const drawBuffer = await ethers.getContract('DrawBuffer')
  const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
  const ticket = await ethers.getContract('Ticket')
  const drawCalculatorTimelock = await ethers.getContract('DrawCalculatorTimelock')

  // ===================================================
  // Deploy Contracts
  // ===================================================

  const prizeDistributionFactoryResult = await deployAndLog('PrizeDistributionFactory', {
    from: deployer,
    args: [
      deployer,
      prizeTierHistory.address,
      drawBuffer.address,
      prizeDistributionBuffer.address,
      ticket.address,
      PRIZE_DISTRIBUTION_FACTORY_MINIMUM_PICK_COST // @NOTE:  1 USDC = 1000000 wei = Minumum ticket cost
    ]
  })
  const beaconTimelockAndPushRouterResult = await deployAndLog('BeaconTimelockAndPushRouter', {
    from: deployer,
    args: [
      deployer,
      prizeDistributionFactoryResult.address,
      drawCalculatorTimelock.address
    ]
  })

  // ===================================================
  // Configure Contracts
  // ===================================================

  await setManager('PrizeDistributionFactory', null, beaconTimelockAndPushRouterResult.address)
  await setManager('BeaconTimelockAndPushRouter', null, defenderRelayer)
  await transferOwnership('PrizeDistributionFactory', null, executiveTeam)
  await transferOwnership('BeaconTimelockAndPushRouter', null, executiveTeam)
}

export default upgradeBeaconEthereumMainnet;