const getUserAndWallet = async (ethers, args) =>{ 
  if(args.wallet > 10) return console.log('Error: Invalid Wallet')
  const wallet = (await ethers.getSigners())[args.wallet || 0 ]
  return {
    wallet,
    user: args && args.user || wallet && wallet.address
  }
}

module.exports = {
  getUserAndWallet
}