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

    const prizeDistributionCount = await prizeDistributionBufferBeaconChain.getPrizeDistributionCount();
    const getNewestPrizeDistribution = await prizeDistributionBufferBeaconChain.getNewestPrizeDistribution();
    const getOldestPrizeDistribution = await prizeDistributionBufferBeaconChain.getOldestPrizeDistribution();
    
    console.log(prizeDistributionCount, 'prizeDistributionCount')
    console.log(getNewestPrizeDistribution.drawId, 'getNewestPrizeDistribution')
    console.log(getOldestPrizeDistribution.drawId, 'getOldestPrizeDistribution')

    try {
        const getDraw1 = await prizeDistributionBufferBeaconChain.getPrizeDistribution(1);
        console.log(getDraw1, 'getDraw1')
    } catch (error) {
        console.log(error, 'error')
    }
}

forkBeaconPrizeDistributionBufferAndTestRingBufferLoop();
