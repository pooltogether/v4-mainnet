const { DateTime } = require('luxon');
const { green, cyan, yellow } = require('chalk');
const { ethers, utils } = require('ethers');
const { getUserAndWallet } = require('./utils/getUserAndWallet');
const { convertErrorToMsg } = require('./utils/convertErrorToMsg');
const { contractConnectWallet } = require('./utils/contractConnectWallet');

/**
 * @name Ticket.balanceOf()
 */
 task("balanceOf", "")
 .addOptionalParam("user", "<address>")
 .addOptionalParam("wallet", "<address>")
 .setAction(async (args, {ethers}) => {
    const { user, wallet } = await getUserAndWallet(ethers, args)
    const ticket = await contractConnectWallet(ethers, 'Ticket', wallet)
    const balanceOf = await ticket.balanceOf(user)
    convertBalanceOfToTable(user, balanceOf)
    return balanceOf
 });

/**
 * @name Ticket.getAccountDetails()
 */
 task("getAccountDetails", "")
 .addOptionalParam("user", "<address>")
 .addOptionalParam("wallet", "<address>")
 .setAction(async (args, {ethers}) => {
    const { user, wallet } = await getUserAndWallet(ethers, args)
    const ticket = await contractConnectWallet(ethers, 'Ticket', wallet)
    const getAccountDetails = await ticket.getAccountDetails(user)
    convertUserToTable(user, getAccountDetails, ticket.address);
    return getAccountDetails;
 });

 /**
 * @name Ticket.getAverageBalancesBetween()
 */
  task("getAverageBalancesBetween", "")
  .addParam("start", "<number>[]")
  .addParam("end", "<number>[]")
  .addOptionalParam("user", "<address>")
  .addOptionalParam("wallet", "<address>")
  .setAction(async (args, {ethers}) => {
    const { user, wallet } = await getUserAndWallet(ethers, args)
    const { start, end } = args
    const rangeStart = start.split(',')
    const rangeEnd = end.split(',')
    const ticket = await contractConnectWallet(ethers, 'Ticket', wallet)
    try {   
      const getAverageBalancesBetween = await ticket.getAverageBalancesBetween(user,rangeStart,rangeEnd)
      getAverageBalancesBetween.forEach((balance, idx) =>  convertBalanceToTable(user, balance, rangeStart[idx], rangeEnd[idx]))
      return getAverageBalancesBetween;
    } catch (error) {
      convertErrorToMsg(error, ticket)
    }
  });

task('totalSupply')
.setAction(async (args, {ethers}) => {
  const { wallet } = await getUserAndWallet(ethers, args)
  const ticket = await contractConnectWallet(ethers, 'Ticket', wallet)
  const totalSupply = ethers.utils.formatUnits((await ticket.totalSupply()).toString(), await ticket.decimals())
  console.log(`Total supply: ${totalSupply} ${await ticket.symbol()}`)
})

/**
 * @name Ticket.transfer()
 */
task("transfer", "")
.addParam("to", "<string>")
.addParam("amount", "<number>[]")
.addOptionalParam("wallet", "<number>")
.setAction(async (args, {ethers}) => {
  const { wallet } = await getUserAndWallet(ethers, args)
  const ticket = await contractConnectWallet(ethers, 'Ticket', wallet)
  const amount = ethers.utils.parseUnits(args.amount, await ticket.decimals())
  try {
    const tx = await ticket.transfer(args.to, amount)
    console.log(tx)
  } catch (error) {
    convertErrorToMsg(error, ticket)
  }
});

/**
 * @name Ticket.delegate()
 */
task("delegate", "")
.addParam("to", "<string>")
.addOptionalParam("wallet", "<number>")
.setAction(async (args, {ethers}) => {
  const { wallet } = await getUserAndWallet(ethers, args)
  const ticket = await contractConnectWallet(ethers, 'Ticket', wallet)
  try {
    const tx = await ticket.delegate(args.to)
    console.log(tx)
  } catch (error) {
    convertErrorToMsg(error, ticket)
  }
});


function convertBalanceOfToTable(account, balance) {
  console.log('-------------------------------------------------------------------------------------------------------------------------')
  console.log('User:', cyan(account), `has a balance of ${cyan(utils.formatEther(balance))}`)
  console.log('-------------------------------------------------------------------------------------------------------------------------')
}

function convertBalanceToTable (user, balance, start, end) {
  const startDate = DateTime.fromMillis(start * 1000);
  const endDate = DateTime.fromMillis(end * 1000);
  const calendarStart = startDate.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
  const calendarEnd = endDate.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
  console.log('----------------------------------------------------------------')
  console.log(green(`Average Balance: ${yellow(ethers.utils.formatEther(balance))} beween timestamp ${yellow(start)} and timestamp ${yellow(end)} `))
  console.log(green(`Calendar Start: ${cyan(calendarStart)}`))
  console.log(green(`Calendar End: ${cyan(calendarEnd)}`))
  console.log('----------------------------------------------------------------')
}

function convertUserToTable (account, user, address) {
  console.log('-------------------------------------------------------------------------------------------------------------------------')
  console.log('User:', cyan(account), `Account details retrieved from ${cyan(address)}`)
  console.log('-------------------------------------------------------------------------------------------------------------------------')
  console.log(green(`Balance: ${cyan(ethers.utils.formatEther(user.balance))}`))
  console.log(green(`NextTwabIndex: ${cyan(user.nextTwabIndex)}`))
  console.log(green(`Cardinality: ${cyan(user.cardinality)}`))
  console.log('------------------------------------------------------------------------------\n')
}
