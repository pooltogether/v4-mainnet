import { dim } from 'chalk';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { deployAndLog } from '../../src/deployAndLog';
import { setManager } from '../../src/setManager';
import { transferOwnership } from '../../src/transferOwnership';

export default async function deployToAvalancheMainnet(hre: HardhatRuntimeEnvironment){
    if (process.env.DEPLOY === 'v1.4.0.avalanche') {
        dim(`Deploying: PrizeTierHistory Avalanche Mainnet`)
        dim(`Version: 1.4.0`)
    } else { return }
    const { deployer, executiveTeam, ptOperations, defenderRelayer } = await hre.getNamedAccounts();
    const drawCalculator = await hre.ethers.getContract('DrawCalculator');

    const prizeTierHistory = await hre.ethers.getContract('PrizeTierHistory');
    const lastPrizeTier = await prizeTierHistory.getPrizeTier(await(prizeTierHistory.getNewestDrawId()));

     /* PrizeTierHistory ------------------ */
    // @dev Required by PrizeDistributionFactory
    /* ----------------------------------- */
    await deployAndLog('PrizeTierHistory', {
        from: deployer,
        args: [deployer],
        skipIfAlreadyDeployed: false,
    });
    const prizeTierHistoryNew = await hre.ethers.getContract('PrizeTierHistory');
    await prizeTierHistoryNew.push(lastPrizeTier)
    
    /* PrizeDistributionFactory ---------- */
    // @dev Immutable reference to new PrizeTierHistory
    // @dev Use existing references for the remaining contracts
    // @dev Required by ReceiverTimelockTrigger
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
    // @dev Required by ReceiverTimelockTrigger
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

    /* ReceiverTimelockTrigger ----------- */
    // @dev Immutable reference to PrizeDistributionFactory
    // @dev Immutable reference to DrawCalculatorTimelock
    /* ----------------------------------- */
    await deployAndLog('ReceiverTimelockTrigger', {
        from: deployer,
        args: [
            deployer,
            drawBuffer.address,
            prizeDistributionFactory.address,
            drawCalculatorTimelock.address,

        ],
        skipIfAlreadyDeployed: false,
    });
    const receiverTimelockTrigger = await hre.ethers.getContract('ReceiverTimelockTrigger');

    /* Management ------------------------ */
    // @dev Updates the sequential manager roles for the new contracts.
    /* ----------------------------------- */
    // PrizeTierHistory managed by ExecutiveTeam
    // @dev Executive team is responsible for pushing new PrizeTiers
    await setManager('PrizeTierHistory', null, executiveTeam);
    // ReceiverTimelockTrigger managed by Defender Relayer
    await setManager('ReceiverTimelockTrigger', null, defenderRelayer);
    // DrawCalculatorTimelock managed by BeaconTimelockTrigger
    await setManager('DrawCalculatorTimelock', null, receiverTimelockTrigger.address);
    // PrizeDistributionFactory managed by DrawCalculatorTimelock
    await setManager('PrizeDistributionFactory', null, drawCalculatorTimelock.address);

    /* Ownership ------------------------- */
    // @dev Relinquishes ownership of the new contracts to the Executive Team.
    /* ----------------------------------- */
    // PrizeDistributionFactory Owned by Executive Team
    await transferOwnership('PrizeDistributionFactory', null, executiveTeam);
    // PrizeTierHistory Owned by PoolTogether Operations
    // @dev Operations can quickly resolve an invalid PrizeTier via popAndPush
    await transferOwnership('PrizeTierHistory', null, ptOperations);

    console.log('Upgrade Complete: v1.4.0.avalanche')
}
