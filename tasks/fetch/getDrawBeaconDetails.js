const hardhat = require('hardhat');
const { ethers } = hardhat

async function getDrawBeaconDetails() {
  const [wallet] = await ethers.getSigners()
  const DrawBeacon = await ethers.getContract('DrawBeacon')
  const beaconPeriodSeconds = await DrawBeacon.getBeaconPeriodSeconds()
  const beaconPeriodStartedAt = await DrawBeacon.getBeaconPeriodStartedAt()
  const drawBuffer = await DrawBeacon.getDrawBuffer()
  const nextDrawId = await DrawBeacon.getNextDrawId()
  const lastRngLockBlock = await DrawBeacon.getLastRngLockBlock()
  const lastRngRequestId = await DrawBeacon.getLastRngRequestId()
  const rngService = await DrawBeacon.getRngService()
  const rngTimeout = await DrawBeacon.getRngTimeout()

  return {
    beaconPeriodSeconds,
    beaconPeriodStartedAt,
    drawBuffer,
    nextDrawId,
    lastRngLockBlock,
    lastRngRequestId,
    rngService,
    rngTimeout,

  }

}

module.exports = {
  getDrawBeaconDetails
}