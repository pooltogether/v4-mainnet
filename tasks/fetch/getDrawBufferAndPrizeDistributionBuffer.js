const hardhat = require('hardhat');
const { range } = require('../utils/helpers');
const { ethers} = hardhat

async function getDrawBufferAndPrizeDistributionBuffer() {
  const prizeDistributor = await ethers.getContract('PrizeDistributor')
  const drawBuffer = await ethers.getContract('DrawBuffer')
  const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
  
  // READ Draw Range
  const newDraw = await drawBuffer.getNewestDraw()
  const oldDraw = await drawBuffer.getOldestDraw()
  const list = range((newDraw.drawId - oldDraw.drawId), oldDraw.drawId) // Generate Draw.drawId list [1,2,4,5,6,7]
  
  // READ PrizeDistribution list
  const drawList = await drawBuffer.getDraws(list)
  const prizeDistributionList = (await prizeDistributionBuffer.getPrizeDistributions(list))
  return [drawList, prizeDistributionList]
}

module.exports = {
  getDrawBufferAndPrizeDistributionBuffer
}