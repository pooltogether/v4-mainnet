
const chalk = require('chalk')
const {BigNumber, ethers} = require("ethers")
const encoder = ethers.utils.defaultAbiCoder;
const { generate } = require('./utils/generate')
task("export-deployments-md", "Exports deployments as a markdown file")
  .setAction(async (taskArgs, hre) => {
    await generate({
      name: "V4 Testnet",
      outputFilePath: `./deployments.md`,
      githubBaseUrl: "https://github.com/pooltogether/v4-rinkeby/tree/master",
    })        
  });


task("draw-stats", "Checks whether an address won a draw")
.addParam("draw", "The draw to check")
.setAction(async (taskArgs, hre) => {
    const { ethers } = hre

    const ticket = await ethers.getContract('Ticket')
    const drawBuffer = await ethers.getContract('DrawBuffer')
    const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
    
    const draw = await drawBuffer.getDraw(taskArgs.draw)
    console.log(chalk.dim(`Winning Number: `, draw.winningRandomNumber))
    console.log(chalk.dim(`Timestamp: `, new Date(draw.timestamp*1000).toString()))

    const prizeDistribution = await prizeDistributionBuffer.getPrizeDistribution(taskArgs.draw)
    console.log(chalk.dim(`Bit range: `, prizeDistribution.bitRangeSize))
    console.log(chalk.dim(`Cardinality: `, prizeDistribution.matchCardinality))
    console.log(chalk.dim(`Prize: `, ethers.utils.formatEther(prizeDistribution.prize)))
    console.log(chalk.dim(`Distributions: `, prizeDistribution.distributions.map(dist => ethers.utils.formatUnits(dist, 9))))
    console.log(chalk.dim(`Total picks: ${(2**prizeDistribution.bitRangeSize)**prizeDistribution.matchCardinality}`))
    console.log(chalk.dim(`Number of picks: `, prizeDistribution.numberOfPicks.toString()))
  });

task("user-stats", "Checks whether an address won a draw")
  .addParam("address", "The address to check")
  .addParam("draw", "the draw to check")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre

    const ticket = await ethers.getContract('Ticket')
    const drawBuffer = await ethers.getContract('DrawBuffer')
    const prizeDistributionBuffer = await ethers.getContract('PrizeDistributionBuffer')
    
    const draw = await drawBuffer.getDraw(taskArgs.draw)
    console.log(chalk.dim(`Winning Number: `, draw.winningRandomNumber))
    console.log(chalk.dim(`Timestamp: `, new Date(draw.timestamp*1000).toString()))

    const prizeDistribution = await prizeDistributionBuffer.getPrizeDistribution(taskArgs.draw)
    console.log(chalk.dim(`Bit range: `, prizeDistribution.bitRangeSize))
    console.log(chalk.dim(`Cardinality: `, prizeDistribution.matchCardinality))
    console.log(chalk.dim(`Prize: `, ethers.utils.formatEther(prizeDistribution.prize)))
    console.log(chalk.dim(`Distributions: `, prizeDistribution.distributions.map(dist => ethers.utils.formatUnits(dist, 9))))
    console.log(chalk.dim(`Total picks: ${(2**prizeDistribution.bitRangeSize)**prizeDistribution.matchCardinality}`))
    console.log(chalk.dim(`Number of picks: `, prizeDistribution.numberOfPicks.toString()))
  });

  task("pool-stats", "Prints pool stats")
  .setAction(async (taskArgs, hre) => {
      const { ethers } = hre
    
      const beacon = await ethers.getContract('DrawBeacon')
      const claimableDraw = await ethers.getContract("ClaimableDraw")
      const history = await ethers.getContract('DrawBuffer')
      const ticket = await ethers.getContract('Ticket')

      const totalSupply = await ticket.totalSupply()
      const prizes = await ticket.balanceOf(claimableDraw.address)
      const eligibleTickets = totalSupply.sub(prizes)

      console.log(chalk.green(`Draw period: ${await beacon.beaconPeriodSeconds()}`))
      console.log(chalk.green(`Last draw: ${(await history.getLastDraw()).drawId}`))
      console.log(chalk.green(`Total Eligible Tickets: ${ethers.utils.formatEther(eligibleTickets)}`))
      console.log(chalk.green(`Prize Liquidity: ${ethers.utils.formatEther(prizes)}`))
    });

  
task("check-draw", "Checks whether an address won a draw")
.addParam("address", "The address to check", "0xE0F4217390221aF47855E094F6e112D43C8698fE")
.addParam("drawId", "The draw to check")
.setAction(async (taskArgs, hre) => {
    const { address, drawId } = taskArgs
    const { ethers } = hre
  
    console.log(chalk.dim(`Checking if ${address} won...`))
    
    const drawBuffer = await ethers.getContract('DrawBuffer')
    console.log("getting draw info for drawId ",drawId, "from ", drawBuffer.address)

    const draw = await drawBuffer.getDraw(drawId)
    console.log("got draw for drawId ", draw)

    const tsunamiDrawSettingsHistory = await ethers.getContract('TsunamiDrawSettingsHistory')
    const drawSettings = await tsunamiDrawSettingsHistory.getDrawSetting(drawId)
    console.log("drawSettings are: ", drawSettings)

    const drawCalculator = await ethers.getContract('DrawCalculator')
    console.log("getting balances from ", drawCalculator.address, " for drawId ", drawId)
    const balances = await drawCalculator.getNormalizedBalancesForDrawIds(address, [drawId])
    console.log("user's balances are ", balances)

    // format BigNUmbers correctly
    let distributionBigNumbers = []
    drawSettings.distributions.forEach(element => {
      distributionBigNumbers.push(BigNumber.from(element))
    })

    tsunamiDrawSettings = {
      ...drawSettings,
      distributions: distributionBigNumbers,
    };
    
    let user = {
      address,
      normalizedBalance: balances[0]
    }
    console.log("running draw calculator...")

    const result = runDrawCalculatorForSingleDraw(tsunamiDrawSettings, draw, user)
    console.log("got draw result ", result.prizes)

    const claim = prepareClaimForUserFromDrawResult(user, result)
    console.log("claim is ", claim)


    const claimPickIndices = encoder.encode(['uint256[][]'], [claim.data]);

    const claimableDraw = await ethers.getContract('ClaimableDraw')
    const claimableDrawResult = await claimableDraw.claim(address, [drawId], claimPickIndices)

    console.log("claimed!!")
});
