const { range } = require('../utils/helpers');

async function getDrawAndPrizeDistributionBuffer(ethers) {
  const drawBuffer = await ethers.getContract('DrawBuffer')
  const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
  
  // READ Draw Range
  const newDraw = await drawBuffer.getNewestDraw()
  const oldDraw = await drawBuffer.getOldestDraw()
  const list = range((newDraw.drawId - oldDraw.drawId), oldDraw.drawId) // Generate Draw.drawId list [1,2,4,5,6,7]
  
  // READ PrizeDistribution list
  const drawList = await drawBuffer.getDraws(list)
  const prizeDistributionList = (await prizeDistributionBuffer.getPrizeDistributions(list))
  
  return [drawList, prizeDistributionList, oldDraw.drawId, newDraw.drawId]
}

module.exports = {
  getDrawAndPrizeDistributionBuffer
}