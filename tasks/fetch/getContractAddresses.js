const idx = require('idx')
const hardhat = require('hardhat');
const { ethers} = hardhat

async function getContractAddresses() {
  let DrawBeacon
  let DrawBuffer
  let DrawCalculator
  let PrizeDistributor
  let Reserve
  let PrizePool
  let PrizeFlush
  let PrizeDistributionBuffer
  let L1TimelockTrigger
  let L2TimelockTrigger
  let DrawCalculatorTimelock

  try {
    DrawBeacon = await ethers.getContract('DrawBeacon')
    DrawBuffer = await ethers.getContract('DrawBuffer')
    DrawCalculator = await ethers.getContract('DrawCalculator')
    PrizeDistributor = await ethers.getContract('PrizeDistributor')
    Reserve = await ethers.getContract('Reserve')
    PrizeFlush = await ethers.getContract('PrizeFlush')
    PrizePool = await ethers.getContract('PrizePool')
    PrizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
    L1TimelockTrigger = await ethers.getContract('L1TimelockTrigger')
    L2TimelockTrigger = await ethers.getContract('L2TimelockTrigger')
    DrawCalculatorTimelock = await ethers.getContract('DrawCalculatorTimelock')
  } catch (error) {
    return {
      DrawBeacon: idx(DrawBeacon, _=>_.address),
      DrawBuffer: idx(DrawBuffer, _=>_.address),
      DrawCalculator: idx(DrawCalculator, _=>_.address),
      PrizeDistributor: idx(PrizeDistributor, _=>_.address),
      PrizeDistributionBuffer: idx(PrizeDistributionBuffer, _=>_.address),
      Reserve: idx(Reserve, _=>_.address),
      PrizePool: idx(PrizePool, _=>_.address),
      PrizeFlush: idx(PrizeFlush, _=>_.address),
      PrizeDistributionBuffer: idx(PrizeDistributionBuffer, _=>_.address),
      L1TimelockTrigger: idx(L1TimelockTrigger, _=>_.address),
      L2TimelockTrigger: idx(L2TimelockTrigger, _=>_.address),
      DrawCalculatorTimelock: idx(DrawCalculatorTimelock, _=>_.address)
    }
  }

  return {
    DrawBeacon: idx(DrawBeacon, _=>_.address),
    DrawBuffer: idx(DrawBuffer, _=>_.address),
    DrawCalculator: idx(DrawCalculator, _=>_.address),
    PrizeDistributor: idx(PrizeDistributor, _=>_.address),
    PrizeDistributionBuffer: idx(PrizeDistributionBuffer, _=>_.address),
    Reserve: idx(Reserve, _=>_.address),
    PrizePool: idx(PrizePool, _=>_.address),
    PrizeFlush: idx(PrizeFlush, _=>_.address),
    PrizeDistributionBuffer: idx(PrizeDistributionBuffer, _=>_.address),
    L1TimelockTrigger: idx(L1TimelockTrigger, _=>_.address),
    L2TimelockTrigger: idx(L2TimelockTrigger, _=>_.address),
    DrawCalculatorTimelock: idx(DrawCalculatorTimelock, _=>_.address)
  }

}

module.exports = {
  getContractAddresses
}