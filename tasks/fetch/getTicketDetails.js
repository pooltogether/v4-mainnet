const hardhat = require('hardhat');
const { ethers } = hardhat

async function getTicketDetails() {
  const [wallet] = await ethers.getSigners()

  const Ticket = await ethers.getContract('Ticket')
  const name = await Ticket.name()
  const symbol = await Ticket.symbol()
  const totalSupply = ethers.utils.formatEther(await Ticket.totalSupply())
  const balanceOf = ethers.utils.formatEther(await Ticket.balanceOf(wallet.address))

  return {
    name,
    symbol,
    totalSupply,
    balanceOf
  }

}

module.exports = {
  getTicketDetails
}