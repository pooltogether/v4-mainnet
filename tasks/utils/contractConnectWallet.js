const contractConnectWallet = async (ethers, contract, wallet) => await (await ethers.getContract(contract)).connect(wallet)

module.exports = {
  contractConnectWallet
}