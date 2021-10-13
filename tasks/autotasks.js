const { cyan, red, greenBright } = require('chalk');
// const contracts = require('../testnet.json');
const { drawBeaconHandleDrawStartAndComplete, L1PrizeDistributionPush, L2DrawAndPrizeDistributionPush } = require('@pooltogether/v4-autotask-lib');
const { getUserAndWallet } = require('./utils/getUserAndWallet');
const debug = require('debug')('tasks')

/**
 * @name DrawBeacon.autotask.drawBeaconHandleDrawStartAndComplete
 * @description Execute the DrawBeacon autotask
 */
 task("autotask-drawbeacon", "Update")
 .setAction(async (args, {ethers}) => {
  const { wallet } = await getUserAndWallet(ethers, args)
  const config = {
    network: 'rinkeby',
    chainId: 4,
    speed: 'fast',
    gasLimit: 500000,
  }

  const { msg, status, transaction, err } = await drawBeaconHandleDrawStartAndComplete(contracts, config);
  if(err && status == -1) return console.log(msg);
  console.log(cyan('--------------------------------------------'))
  console.log(cyan('Status:'), greenBright(msg))
  console.log(cyan('--------------------------------------------'))
  debug("transaction:", transaction)
  debug("status:", status)

  // IF DrawBeacon needs to pust a Draw state forward execute a transaction. 
  if(status == 1) {
    console.log('Executing:', msg)
    tx = await wallet.sendTransaction({
      data: transaction.data,
      to: transaction.to,
    });
    console.log('Hash:', tx.hash)
    tx.wait()
    console.log('Completed:', msg)
  }
});

/**
 * @name DrawBeacon.autotask.L1PrizeDistributionPush
 * @description Execute the DrawBeacon autotask
 */
 task("autotask-L1", "Update")
 .setAction(async (args, {ethers}) => {
  const { wallet } = await getUserAndWallet(ethers, args)
  const config = {
    network: "rinkeby",
    chainId: 4,
    speed: "fast",
    gasLimit: 50000,
    execute: false,
    apiKey: process.env.INFURA_API_KEY,
    L1: {
      chainId: 4,
      network: 'rinkeby',
    },
    L2: {
      chainId: 80001,
      network: 'polygon-mumbai',
    },
  }

  const { msg, status, transaction, err } = await L1PrizeDistributionPush(contracts, config);
  if(err && status == -1) return console.log(msg);
  console.log(cyan('--------------------------------------------'))
  console.log(cyan('Status:'), greenBright(msg))
  console.log(cyan('--------------------------------------------'))
  debug("transaction:", transaction)
  debug("status:", status)

  // IF DrawBeacon needs to pust a Draw state forward execute a transaction. 
  if(status == 1) {
    console.log('Executing:', msg)
    tx = await wallet.sendTransaction({
      data: transaction.data,
      to: transaction.to,
    });
    console.log('Hash:', tx.hash)
    tx.wait()
    console.log('Completed:', msg)
  }
});

/**
 * @name DrawBeacon.autotask.L2DrawAndPrizeDistributionPush
 * @description Execute the DrawBeacon autotask
 */
 task("autotask-L2", "Update")
 .setAction(async (args, {ethers}) => {
  const { wallet } = await getUserAndWallet(ethers, args)
  const config = {
    network: "rinkeby",
    chainId: 4,
    speed: "fast",
    gasLimit: 50000,
    execute: false,
    apiKey: process.env.INFURA_API_KEY,
    L1: {
      chainId: 4,
      network: 'rinkeby',
    },
    L2: {
      chainId: 80001,
      network: 'polygon-mumbai',
    },
  }

  const { msg, status, transaction, err } = await L2DrawAndPrizeDistributionPush(contracts, config);
  if(err && status == -1) return console.log(msg);
  console.log(cyan('--------------------------------------------'))
  console.log(cyan('Status:'), greenBright(msg))
  console.log(cyan('--------------------------------------------'))
  debug("transaction:", transaction)
  debug("status:", status)

  // IF DrawBeacon needs to pust a Draw state forward execute a transaction. 
  if(status == 1) {
    console.log('Executing:', msg)
    tx = await wallet.sendTransaction({
      data: transaction.data,
      to: transaction.to,
    });
    console.log('Hash:', tx.hash)
    tx.wait()
    console.log('Completed:', msg)
  }
});