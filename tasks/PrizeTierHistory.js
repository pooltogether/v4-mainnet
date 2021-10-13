
const { getUserAndWallet } = require('./utils/getUserAndWallet');
const { contractConnectWallet } = require('./utils/contractConnectWallet');

/**
 * @name PrizeTierHistory.setPrizeTier()
 */
 task("setPrizeTier", "")
 .addOptionalParam("user", "<address>")
 .addOptionalParam("wallet", "<address>")
 .setAction(async (args, {ethers}) => {
    const { user, wallet } = await getUserAndWallet(ethers, args)
    const prizeTierHistory = await contractConnectWallet(ethers, 'PrizeTierHistory', wallet)
    const prizeTier = {
      drawId: 1,
      bitRangeSize: 10,
      maxPicksPerUser:1000000000,
      prize: 1000000000,
      tiers: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      validityDuration: 86400,
    }
    await prizeTierHistory.push(prizeTier)

 });