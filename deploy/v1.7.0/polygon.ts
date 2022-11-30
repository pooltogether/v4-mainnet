import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import {
  BEACON_PERIOD_SECONDS,
  RNG_TIMEOUT_SECONDS,
} from '../../src/constants';
import { deployAndLog } from '../../src/deployAndLog';
import { setManager } from '../../src/setManager';
import { transferOwnership } from '../../src/transferOwnership';

export default async function deployToEthereumMainnet(hardhat: HardhatRuntimeEnvironment){
  if (process.env.DEPLOY === 'v1.7.0.polygon') {
    dim(`Deploying: DrawBeacon, RNGChainlinkV2, BeaconTimelockTrigger on Polygon`)
    dim(`Version: 1.7.0`)
  } else { return }

  const { getNamedAccounts, ethers } = hardhat;
  const { getContract } = ethers;

  const { deployer, defenderRelayer, executiveTeam } = await getNamedAccounts();

  const drawBuffer = await getContract('DrawBuffer');
  const drawCalculatorTimelock = await getContract('DrawCalculatorTimelock')
  const prizeDistributionFactory = await getContract('PrizeDistributionFactory');

  // ===================================================
  // Deploy Contracts
  // ===================================================

  const rngServiceResult = await deployAndLog('RNGChainlinkV2', {
    from: deployer,
    args: [
      deployer,
      '0xAE975071Be8F8eE67addBC1A82488F1C24858067', // VRF Coordinator address
      472, // Subscription id
      '0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd', // 500 gwei key hash gas lane
    ],
    skipIfAlreadyDeployed: true,
  });

  const drawBeaconResult = await deployAndLog('DrawBeacon', {
    from: deployer,
    args: [
      deployer,
      drawBuffer.address,
      rngServiceResult.address,
      411, // Starting DrawID
      1669748400, // Nov 29, 2022, 7:00:00 PM UTC
      BEACON_PERIOD_SECONDS, // 86400 = one day
      RNG_TIMEOUT_SECONDS // 2 * 3600 = 2 hours
    ],
    skipIfAlreadyDeployed: true,
  });

  await deployAndLog('BeaconTimelockTrigger', {
    from: deployer,
    args: [
      deployer,
      prizeDistributionFactory.address,
      drawCalculatorTimelock.address
    ]
  });

  await setManager('RNGChainlinkV2', null, drawBeaconResult.address);
  await setManager('BeaconTimelockTrigger', null, defenderRelayer);

  await transferOwnership('RNGChainlinkV2', null, executiveTeam);
  await transferOwnership('DrawBeacon', null, executiveTeam);
  await transferOwnership('BeaconTimelockTrigger', null, executiveTeam);
}
