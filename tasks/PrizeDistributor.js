const { ethers } = require('ethers');
const { cyan } = require('chalk');
const { range } = require('./utils/range');
const { getUserAndWallet } = require('./utils/getUserAndWallet');
const { prepareClaims, batchCalculateDrawResults } = require('@pooltogether/draw-calculator-js');

/**
 * @name PrizeDistributor.claim()
 */
 task("claim", "Claim prizes from DrawPrizs")
 .addOptionalParam("user", "<address>")
 .addOptionalParam("wallet", "<address>")
 .setAction(async (args, {ethers}) => {
    const { user, wallet } = await getUserAndWallet(ethers, args)
    const prizeDistributor = await (await ethers.getContract('PrizeDistributor')).connect(wallet)
    const drawBuffer = await ethers.getContract('DrawBuffer')
    const drawCalculatorContract = await ethers.getContract('DrawCalculator')
    const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
    
    // READ Draw Range
    const newDraw = await drawBuffer.getNewestDraw()
    const oldDraw = await drawBuffer.getOldestDraw()
    const list = range((newDraw.drawId - oldDraw.drawId), oldDraw.drawId) // Generate Draw.drawId list [1,2,4,5,6,7]
    
    // READ PrizeDistribution list
    const drawList = await drawBuffer.getDraws(list)
    const prizeDistributionList = (await prizeDistributionBuffer.getPrizeDistributions(list))
    
    // READ Normalized Balances
    const [balances] = await drawCalculatorContract.functions.getNormalizedBalancesForDrawIds(user, list) 
    balances.forEach((bal, idx) => convertBalanceOfToTable(bal, list[idx]))

    // CREATE User struct
    const User = {
      address: user,
      normalizedBalances: balances,
    }

    const results = batchCalculateDrawResults(prizeDistributionList, drawList, User)
    if(results.length === 0) return console.log(`No Winning PickIndices`)

    const USER_CLAIM = prepareClaims(User, results)
    if(USER_CLAIM.winningPickIndices.length == 0 ) {
      console.log('No Winning Pick Indices!')
    } else {
      USER_CLAIM.winningPickIndices.map(picks => {
        console.log(picks)
      })
    }

    await prizeDistributor.claim(USER_CLAIM.userAddress, USER_CLAIM.drawIds, USER_CLAIM.encodedWinningPickIndices )
    return console.log('PrizeDistributor claim complete...')
 });


 function convertBalanceOfToTable(balance, drawId) {
  const percentage = ethers.utils.formatEther(balance.mul('10')).toString().slice(0, 4)
  console.log('-------------------------------------------------------------------------------------------------------------------------')
  console.log(`For ${cyan(`Draw ${drawId}`)} :`, `your aveage normalized balance was ${cyan(ethers.utils.formatEther(balance))} or roughly ${percentage}% of the total supply`)
  console.log('-------------------------------------------------------------------------------------------------------------------------')
}
