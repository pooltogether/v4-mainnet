import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { deployAndLog } from '../../src/deployAndLog';
import { setManager } from '../../src/setManager';
import { transferOwnership } from '../../src/transferOwnership';

export default async function deployToEthereumMainnet(hardhat: HardhatRuntimeEnvironment){
  if (process.env.DEPLOY === 'v1.5.0.mainnet') {
    dim(`Deploying: TWAB Delegator Ethereum Mainnet`)
    dim(`Version: 1.5.0`)
  } else { return }

  const { getNamedAccounts, ethers } = hardhat;
  const { getContract } = ethers;

  const { deployer, executiveTeam } = await getNamedAccounts();

  const drawBeacon = await getContract('DrawBeacon');

  // ===================================================
  // Deploy Contracts
  // ===================================================

  await deployAndLog('RNGChainlinkV2', {
    from: deployer,
    args: [
      deployer,
      '0x271682DEB8C4E0901D1a1550aD2e64D568E69909', // VRF Coordinator address
      63, // Subscription id
      '0xff8dedfbfa60af186cf3c830acbc32c05aae823045ae5ea7da1e45fbfaba4f92', // 500 gwei key hash gas lane
    ],
    skipIfAlreadyDeployed: true,
  });

  await setManager('RNGChainlinkV2', null, drawBeacon.address);

  const rngService = await getContract('RNGChainlinkV2');
  await transferOwnership('RNGChainlinkV2', rngService, executiveTeam);
}
