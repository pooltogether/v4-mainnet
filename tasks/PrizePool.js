const { cyan } = require('chalk');
const emoji = require('node-emoji');
const debug = require('debug')('tasks')
const { getUserAndWallet } = require('./utils/getUserAndWallet');

task("deposit", "Deposits into the pool")
.addOptionalParam("user", "<address>")
.addOptionalParam("wallet", "<address>")
.addParam("amount", "The amount to deposit", '0')
.setAction(async (args, { ethers }) => {
    const { user, wallet } = await getUserAndWallet(ethers, args)
    debug(user, wallet)
  
    const yieldSource = await ethers.getContract('MockYieldSource')
    const prizePool = await ethers.getContract('YieldSourcePrizePool')
    const token = await ethers.getContractAt('ERC20Mintable', await yieldSource.depositToken())
    const decimals = await token.decimals()

    const balance = await token.balanceOf(wallet.address)
    if (!balance.gte(ethers.utils.parseUnit(args.amount, decimals))) {
      debug(`Insufficient balance; minting...`)
      const txMint = await token.mint(wallet.address, ethers.utils.parseUnit(args.amount, decimals))
      await txMint.wait()
    }

    debug(`Approving...`)
    const txApprove = await token.connect(wallet).approve(prizePool.address, ethers.utils.parseUnit(args.amount, decimals))
    console.log(cyan(emoji.find('🕰️').emoji, ` Approving Deposit to PrizePool`))
    await txApprove.wait()

    debug(`Depositing...`)
    await prizePool.connect(wallet).depositTo(wallet.address, ethers.utils.parseUnit(args.amount, decimals))

    console.log(cyan(emoji.find('✅').emoji, `Deposited ${args.amount} tokens and received ${args.amount} tickets`))
  });