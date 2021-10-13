const { BigNumber } = require("@ethersproject/bignumber")
const { computePicks, batchCalculateDrawResults } = require('@pooltogether/draw-calculator-js');
const { green, cyan } = require("chalk")
const { ethers } = require("ethers")
const debug = require('debug')('tasks')

const { range } = require("./utils/helpers")
const { getUserAndWallet } = require('./utils/getUserAndWallet');
const { getDrawAndPrizeDistributionBuffer } = require("./fetch/getDrawAndPrizeDistributionBuffer")

task("winningPickIndices", "")
.addOptionalParam("user", "<address>")
.addOptionalParam("wallet", "<address>")
.setAction(async (args, {ethers}) => {
  const { user, wallet } = await getUserAndWallet(ethers, args)
  debug(user, wallet)
  const drawCalculatorContract = await ethers.getContract('DrawCalculator')
  const [drawList, prizeDistributionList, oldestId, newestId] = await getDrawAndPrizeDistributionBuffer(ethers);
  
  // Normalized Balances
  const list = range((newestId - oldestId), oldestId) // Generate Draw.drawId list [1,2,4,5,6,7]
  const [balances] = await drawCalculatorContract.functions.getNormalizedBalancesForDrawIds(user, list)
  
  // CREATE User struct
  const User = {
    address: user,
    normalizedBalances: balances,
  }
  
  const results = batchCalculateDrawResults(prizeDistributionList, drawList, User)
  if(results.length === 0) return console.log(`No Winning PickIndices`)
  balances.forEach((bal, idx) => convertPreparedClaimToTable(results[idx], bal, list[idx]))
})

/**
 * @name DrawCalculatorJs.generatePicks()
*/
task("generatePicks", "")
.addParam("address", "", "")
.addOptionalParam("start", "", "")
.addOptionalParam("end", "", "")
.setAction(async (args, hre) => {
  console.log('-------------------------------------------------------------------------------------------------------------------------')
  console.log(`Generang Picks for  ${cyan(args.address)}`)
  console.log('-------------------------------------------------------------------------------------------------------------------------')
  const paddedAddressBytes32 = ethers.utils.defaultAbiCoder.encode([ "address"], [ args.address])
  computePicks(paddedAddressBytes32, range((args.end - args.start) || 101, args.start || 0)
    .map(i => BigNumber.from(i)))
    .forEach(pick => convertPickToTable(pick, args.address))

})

task("generatePicks", "")
.addOptionalParam("user", "<address>")
.addOptionalParam("wallet", "<address>")
.setAction(async (args, {ethers}) => {
  const [drawList, prizeDistributionList] = getDrawAndPrizeDistributionBuffer()
})



function convertPickToTable (pick, address) {
  console.log(green(`Pick ${pick.index}: ${BigNumber.from(pick.hash).toString()}`))

}

/* ==================================================*/
// Consoole Log Views
/* ================================================== */

function convertPreparedClaimToTable(drawResults, averageBalance, drawId) {
  console.log('-------------------------------------------------------------------------------------------------------------------------')
  console.log(`For ${cyan(`Draw ${drawId}`)} :`, `your avg balance was ${cyan(ethers.utils.formatEther(averageBalance))} and had ${drawResults && drawResults.prizes &&  drawResults.prizes.length} prize(s) and total value of ${ethers.utils.formatEther(drawResults.totalValue)}`)
  if(drawResults && drawResults.prizes && drawResults.prizes.length > 0) {
    drawResults.prizes
    .forEach((result, idx) => 
      console.log(
`
Pick ${idx} 
  - PrizeTier: ${cyan(result.distributionIndex)}
  - Value: ${cyan(ethers.utils.formatEther(result.amount))} Tickets
`))
  }
  console.log('-------------------------------------------------------------------------------------------------------------------------')
}