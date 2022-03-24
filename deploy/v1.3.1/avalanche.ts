import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { deployAndLog } from '../../src/deployAndLog';

export default async function deployToAvalancheMainnet(hre: HardhatRuntimeEnvironment){
    if (process.env.DEPLOY === 'v1.3.1.avalanche') {
        dim(`Deploying: PrizeTierHistory Avalanche Mainnet`)
        dim(`Version: 1.3.1`)
    } else { return }
    const { deployer } = await hre.getNamedAccounts();
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
    const drawBuffer = '0x31bcaf169d25f938a25c2e4c762f3d1d3fa7db2e'
    const prizeDistributionBuffer = '0xc8faa39e06ddb8362cb8e3ffdadeb5bf7877eccb'
    const ticket = '0xb27f379c050f6ed0973a01667458af6ecebc1d90'
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

    console.log('Upgrade Complete: v1.3.1.avalanche')
}
