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
  if (process.env.DEPLOY === 'v1.8.0.avalanche') {
    dim(`Deploying: DrawBeacon, RNGChainlinkV2, BeaconTimelockTrigger on Avalanche`)
    dim(`Version: 1.8.0`)
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
      '0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634', // VRF Coordinator address
      97, // Subscription id
      '0x89630569c9567e43c4fe7b1633258df9f2531b62f2352fa721cf3162ee4ecb46', // 500 gwei key hash gas lane
    ],
    skipIfAlreadyDeployed: true,
  });

  const drawBeaconResult = await deployAndLog('DrawBeacon', {
    from: deployer,
    args: [
      deployer,
      drawBuffer.address,
      rngServiceResult.address,
      413, // Starting DrawID
      1669921200, // Dec 1, 2022, 7:00:00 PM UTC
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
