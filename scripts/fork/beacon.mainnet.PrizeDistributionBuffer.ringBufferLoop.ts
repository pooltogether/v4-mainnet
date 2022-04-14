import hre from 'hardhat';
import impersonateNamedAccounts from './helpers/impersonateNamedAccounts';
import distributeEthToAccounts from './helpers/distributeEthToAccounts';

export async function forkBeaconPrizeDistributionBufferAndTestRingBufferLoop() {
    const chainId = await hre.getChainId();
    const { executiveTeam } = await hre.getNamedAccounts();
    console.log('ChainID: ', chainId);
    await distributeEthToAccounts();
    await impersonateNamedAccounts(executiveTeam);
    const signer = await hre.ethers.getSigner(executiveTeam);
    const prizeDistributionBufferBeaconChain = await hre.ethers.getContract('PrizeDistributionBuffer', signer);
    const newestPrizeDistribution = await prizeDistributionBufferBeaconChain.getNewestPrizeDistribution();
    
    for (let index = 1; index < 4; index++) {
        await prizeDistributionBufferBeaconChain.pushPrizeDistribution(
            newestPrizeDistribution.drawId + index, 
            newestPrizeDistribution.prizeDistribution
        );
    }

    const drawCount = await prizeDistributionBufferBeaconChain.getPrizeDistributionCount();
    const getNewestDraw = await prizeDistributionBufferBeaconChain.getNewestPrizeDistribution();
    const getOldestDraw = await prizeDistributionBufferBeaconChain.getOldestPrizeDistribution();
    
    console.log(drawCount, 'drawCount')
    console.log(getNewestDraw.drawId, 'getNewestDraw')
    console.log(getOldestDraw.drawId, 'getOldestDraw')

    try {
        const getDraw1 = await prizeDistributionBufferBeaconChain.getPrizeDistribution(1);
        console.log(getDraw1, 'getDraw1')
    } catch (error) {
        console.log(error, 'error')
    }
}

forkBeaconPrizeDistributionBufferAndTestRingBufferLoop();
