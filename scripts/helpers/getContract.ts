export const getContract = async (hardhat, name) => {
  const { deployments } = hardhat
  const signers = await hardhat.ethers.getSigners()
  return hardhat.ethers.getContractAt(name, (await deployments.get(name)).address, signers[0])
}