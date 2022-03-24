import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { deployAndLog } from '../../src/deployAndLog';

export default async function deployToPolygonMainnet(hardhat: HardhatRuntimeEnvironment){
    if (process.env.DEPLOY === 'v1.3.1.polygon') {
        dim(`Deploying: PrizeTierHistory Polygon Mainnet`)
        dim(`Version: 1.3.1`)
    } else { return }
    const { getNamedAccounts} = hardhat;
    const { deployer } = await getNamedAccounts();
    await deployAndLog('PrizeTierHistory', {
        from: deployer,
        args: [deployer],
        skipIfAlreadyDeployed: false,
    });
}
