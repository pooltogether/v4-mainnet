import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { deployAndLog } from '../../src/deployAndLog';

export default async function deployToPolygonMainnet(hre: HardhatRuntimeEnvironment){
    if (process.env.DEPLOY === 'v1.3.1.polygon') {
        dim(`Deploying: PrizeTierHistory Polygon Mainnet`)
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
    console.log('Upgrade Complete: v1.3.1.mainnet')
}
