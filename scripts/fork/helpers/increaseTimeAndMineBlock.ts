import hre from "hardhat"

async function increaseTimeAndMineBlock(time) {
  await hre.ethers.provider.send('evm_increaseTime', [ time ])
  await hre.ethers.provider.send('evm_mine', [])
  console.log('TimeIncreased: ', time)
}

export default increaseTimeAndMineBlock