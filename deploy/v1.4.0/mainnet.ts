import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { deployAndLog } from '../../src/deployAndLog';
import { setManager } from '../../src/setManager';
import { transferOwnership } from '../../src/transferOwnership';

export default async function deployToEthereumMainnet(hre: HardhatRuntimeEnvironment){
    if (process.env.DEPLOY === 'v1.4.0.mainnet') {
        dim(`Deploying: PrizeTierHistory Ethereum Mainnet`)
        dim(`Version: 1.4.0`)
    } else { return }
    const { deployer, executiveTeam } = await hre.getNamedAccounts();
    const beaconTimelockTrigger = await hre.ethers.getContract('BeaconTimelockTrigger');
    const prizeTierHistory = await hre.ethers.getContract('PrizeTierHistory');
    const lastPrizeTier = await prizeTierHistory.getPrizeTier(await(prizeTierHistory.getNewestDrawId()));
    await deployAndLog('PrizeTierHistory', {
        from: deployer,
        args: [deployer],
        skipIfAlreadyDeployed: false,
    });
    const prizeTierHistoryNew = await hre.ethers.getContract('PrizeTierHistory');
    await prizeTierHistoryNew.push(lastPrizeTier)

    // Create a new instance of a PrizeDistributionFactory, and deploy it.
    // PrizeDistributionFactory has an immutable reference to PrizeTierHistory.
    const drawBuffer = '0x78ea5a9595279dc2f9608283875571b1151f19d4'
    const prizeDistributionBuffer = '0xf025a8d9e6080f885e841c8cc0e324368d7c6577'
    const ticket = '0xdd4d117723c257cee402285d3acf218e9a8236e1'
    const minPickCost = 1000000
    await deployAndLog('PrizeDistributionFactory', {
        from: deployer,
        args: [
            deployer,
            prizeTierHistoryNew.address,
            drawBuffer,
            prizeDistributionBuffer,
            ticket,
            minPickCost,
        ],
        skipIfAlreadyDeployed: false,
    });

    await setManager('PrizeDistributionFactory', null, beaconTimelockTrigger.address);
    await transferOwnership('PrizeDistributionFactory', null, executiveTeam);
    await transferOwnership('PrizeTierHistory', null, executiveTeam);
    
    console.log('Upgrade Complete: v1.4.0.mainnet')
}
