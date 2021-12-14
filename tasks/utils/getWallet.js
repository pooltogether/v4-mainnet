const getWallet = async (ethers, index) => (await ethers.getSigners())[index]

module.exports = {
  getWallet
}