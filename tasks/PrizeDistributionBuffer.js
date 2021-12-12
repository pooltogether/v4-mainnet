const { green, cyan } = require('chalk');
const { range } = require('./utils/range');
const { mapIdToObject } = require('./utils/mapIdToObject');

/**
 * @name getPrizeDistribution
 */
task("getPrizeDistribution", "Read single prize distribution parameters")
.addParam("id", "")
.setAction(async ({id}, { ethers }) => {
    const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
    const prizeDistribution = await prizeDistributionBuffer.getPrizeDistribution(id)
    convertPrizeDistributionToTable(prizeDistribution.drawId, prizeDistribution, prizeDistributionBuffer.address )
});

/**
 * @name getOldestPrizeDistribution
 */
 task("getOldestPrizeDistribution")
 .setAction(async (args, { ethers }) => {
     const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
     const {drawId, prizeDistribution}  = await prizeDistributionBuffer.getOldestPrizeDistribution()
     convertPrizeDistributionToTable(drawId, prizeDistribution, prizeDistributionBuffer.address)
   });
 
 /**
  * @name getNewestPrizeDistribution
  */
 task("getNewestPrizeDistribution")
 .setAction(async (args, { ethers }) => {
     const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
     const {drawId, prizeDistribution}  = await prizeDistributionBuffer.getNewestPrizeDistribution()
     convertPrizeDistributionToTable(drawId, prizeDistribution, prizeDistributionBuffer.address)
   });

/**
 * @name getPrizeDistributionList
 */
task("getPrizeDistributionList", "Read list of prize distribution parameters")
.addParam("drawIds", "<string> (1,2,3) ")
.setAction(async ({drawIds}, { ethers }) => {
    const prizeDist = await ethers.getContract('PrizeDistributionBuffer')
    const range = drawIds.split(',')
    prizeDistributionList = await prizeDist.getPrizeDistributions(range)
    mapIdToObject(range, prizeDistributionList)
        .forEach(prizeDistributionWithId => 
            convertPrizeDistributionToTable(
                prizeDistributionWithId.drawId, 
                prizeDistributionWithId.prizeDistribution, 
                prizeDist.address
            ))
});

/**
 * @name getPrizeDistribution
 */
 task("getLivePrizeDistribution", "Read all prize distribution(s) parameters from oldest to newest")
 .setAction(async (args, {ethers}) => {
    const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
    const {drawId: drawIdNewest } = await prizeDistributionBuffer.getNewestPrizeDistribution()
    const {drawId: drawIdOldest } = await prizeDistributionBuffer.getOldestPrizeDistribution()
    const list = range((drawIdNewest - drawIdOldest), drawIdOldest) // Generate Draw.drawId list [1,2,4,5,6,7]
    prizeDistributionList = await prizeDistributionBuffer.getPrizeDistributions(list)
    mapIdToObject(
            list,
            prizeDistributionList
        ).forEach(prizeDistributionWithId => 
            convertPrizeDistributionToTable(
                prizeDistributionWithId.drawId, 
                prizeDistributionWithId.prizeDistribution, 
                prizeDistributionBuffer.address
            ))
    console.log(`Total PrizeDistribution(s): ${prizeDistributionList.length}`)
    console.log('--------------------------')

    return mapIdToObject(
        list,
        prizeDistributionList
    );
 });

function convertPrizeDistributionToTable (drawId, prizeDistribution, address) {
    console.log('----------------------------------------------------------------------------')
    console.log('Draw ID:', drawId, `retrieved from ${address}`)
    console.log('----------------------------------------------------------------------------')

    console.log(green(`Prize: ${cyan(ethers.utils.formatUnits(prizeDistribution.prize, 6))}`))
    console.log(green(`BitRange: ${cyan(prizeDistribution.bitRangeSize)}`))
    console.log(green(`MatchCardinality: ${cyan(prizeDistribution.matchCardinality)}`))
    console.log(green(`Start timestamp offset: ${cyan(prizeDistribution.startTimestampOffset)}`))
    console.log(green(`End timestamp offset: ${cyan(prizeDistribution.endTimestampOffset)}`))
    console.log(green(`Max User Picks: ${cyan(prizeDistribution.maxPicksPerUser)}`))
    console.log(green(`Number of Picks: ${cyan(prizeDistribution.numberOfPicks)}`))
    console.log(green(`Total picks:\t ${(2**prizeDistribution.bitRangeSize)**prizeDistribution.matchCardinality}`))
    console.log('----------------------------------------------------------------------------\n')
}