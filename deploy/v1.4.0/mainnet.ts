import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { deployAndLog } from '../../src/deployAndLog';
import { setManager } from '../../src/setManager';
import { transferOwnership } from '../../src/transferOwnership';

/**
 * @description Updates the PrizeTierHistory with an optimized BinarySearchLib contract.
 * @dev Due to the immutably linking contracts together, a series of new contracts must be deployed
 *      in succession and the PrizePool must be updated by the PoolTogether executive team.
 */
export default async function deployToEthereumMainnet(hre: HardhatRuntimeEnvironment){
    if (process.env.DEPLOY === 'v1.4.0.mainnet') {
        dim(`Deploying: PrizeTierHistory Ethereum Mainnet`)
        dim(`Version: 1.4.0`)
    } else { return }

    const { deployer, executiveTeam, ptOperations, defenderRelayer } = await hre.getNamedAccounts();
    const drawCalculator = await hre.ethers.getContract('DrawCalculator');

    const prizeTierHistoryOld = await hre.ethers.getContract('PrizeTierHistory');
    const lastPrizeTier = await prizeTierHistoryOld.getPrizeTier(await(prizeTierHistoryOld.getNewestDrawId()));
    
    /* PrizeTierHistory ------------------ */
    // @dev Required by PrizeDistributionFactory
    /* ----------------------------------- */
    await deployAndLog('PrizeTierHistory', {
        from: deployer,
        args: [deployer],
        skipIfAlreadyDeployed: false,
    });
    const prizeTierHistory = await hre.ethers.getContract('PrizeTierHistory');
    await prizeTierHistory.push(lastPrizeTier)

    /* PrizeDistributionFactory ---------- */
    // @dev Immutable reference to new PrizeTierHistory
    // @dev Use existing references for the remaining contracts
    // @dev Required by BeaconTimelockTrigger
    /* ----------------------------------- */
    const drawBuffer = await hre.ethers.getContract('DrawBuffer');
    const prizeDistributionBuffer = await hre.ethers.getContract('PrizeDistributionBuffer');
    const ticket = await hre.ethers.getContract('Ticket');
    const minPickCost = 1000000
    await deployAndLog('PrizeDistributionFactory', {
        from: deployer,
        args: [
            deployer,
            prizeTierHistory.address,
            drawBuffer.address,
            prizeDistributionBuffer.address,
            ticket.address,
            minPickCost,
        ],
        skipIfAlreadyDeployed: false,
    });
    const prizeDistributionFactory = await hre.ethers.getContract('PrizeDistributionFactory');

    /* DrawCalculatorTimelock ------------ */
    // @dev Required by BeaconTimelockTrigger
    /* ----------------------------------- */
    await deployAndLog('DrawCalculatorTimelock', {
        from: deployer,
        args: [
            deployer,
            drawCalculator.address
        ],
        skipIfAlreadyDeployed: false,
    });
    const drawCalculatorTimelock = await hre.ethers.getContract('DrawCalculatorTimelock');

    /* BeaconTimelockTrigger ------------- */
    // @dev Immutable reference PrizeDistributionFactory
    // @dev Immutable reference DrawCalculatorTimelock
    /* ----------------------------------- */
    await deployAndLog('BeaconTimelockTrigger', {
        from: deployer,
        args: [
            deployer,
            prizeDistributionFactory.address,
            drawCalculatorTimelock.address,

        ],
        skipIfAlreadyDeployed: false,
    });

    const beaconTimelockTrigger = await hre.ethers.getContract('BeaconTimelockTrigger');

    /* Management ------------------------ */
    // @dev Updates the manager roles for new contracts. A sequential management access control scheme is used.
    /* ----------------------------------- */
    // PrizeTierHistory managed by ExecutiveTeam
    // @dev Executive team is responsible for pushing new PrizeTiers
    await setManager('PrizeTierHistory', null, executiveTeam);
    // BeaconTimelockTrigger managed by Defender Relayer
    await setManager('BeaconTimelockTrigger', null, defenderRelayer); 
    // DrawCalculatorTimelock managed by BeaconTimelockTrigger
    await setManager('DrawCalculatorTimelock', null, beaconTimelockTrigger.address);
    // PrizeDistributionFactory managed by DrawCalculatorTimelock
    await setManager('PrizeDistributionFactory', null, drawCalculatorTimelock.address); 

    /* Ownership ------------------------- */
    // @dev Relinquishes ownership of the new contracts to the Executive Team.
    /* ----------------------------------- */
    // PrizeTierHistory Owned by Executive Team
    // @dev Operations can quickly resolve an invalid PrizeTier via popAndPush
    await transferOwnership('PrizeTierHistory', null, ptOperations);
    // DrawCalculatorTimelock Owned by Executive Team
    await transferOwnership('DrawCalculatorTimelock', null, executiveTeam);
    // PrizeDistributionFactory Owned by Executive Team
    await transferOwnership('PrizeDistributionFactory', null, executiveTeam);
    // BeaconTimelockTrigger Owned by Executive Team
    await transferOwnership('BeaconTimelockTrigger', null, executiveTeam);
    
    console.log('Upgrade Complete: v1.4.0.mainnet')
}
