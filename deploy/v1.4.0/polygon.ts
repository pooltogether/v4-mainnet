import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { deployAndLog } from '../../src/deployAndLog';
import { setManager } from '../../src/setManager';
import { transferOwnership } from '../../src/transferOwnership';

export default async function deployToPolygonMainnet(hre: HardhatRuntimeEnvironment){
    if (process.env.DEPLOY === 'v1.4.0.polygon') {
        dim(`Deploying: PrizeTierHistory Polygon Mainnet`)
        dim(`Version: 1.4.0`)
    } else { return }
    const { deployer, executiveTeam } = await hre.getNamedAccounts();
    const receiverTimelockTrigger = await hre.ethers.getContract('ReceiverTimelockTrigger');
    const prizeTierHistory = await hre.ethers.getContract('PrizeTierHistory');
    const lastPrizeTier = await prizeTierHistory.getPrizeTier(await(prizeTierHistory.getNewestDrawId()));
    await deployAndLog('PrizeTierHistory', {
        from: deployer,
        args: [deployer],
        skipIfAlreadyDeployed: true,
    });
    const prizeTierHistoryNew = await hre.ethers.getContract('PrizeTierHistory');
    await prizeTierHistoryNew.push(lastPrizeTier)
    
    // Create a new instance of a PrizeDistributionFactory, and deploy it.
    // PrizeDistributionFactory has an immutable reference to PrizeTierHistory.
    const drawBuffer = '0x44b1d66e7b9d4467139924f31754f34cbc392f44'
    const prizeDistributionBuffer = '0xcf6030bdeab4e503d186426510ad88c1da7125a3'
    const ticket = '0x6a304dfdb9f808741244b6bfee65ca7b3b3a6076'
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
        skipIfAlreadyDeployed: true,
    });

    await setManager('PrizeDistributionFactory', null, receiverTimelockTrigger.address);
    await transferOwnership('PrizeDistributionFactory', null, executiveTeam);
    await transferOwnership('PrizeTierHistory', null, executiveTeam);

    console.log('Upgrade Complete: v1.4.0.polygon')
}
