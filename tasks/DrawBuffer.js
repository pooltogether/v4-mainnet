const { red, green, cyan } = require('chalk');
const emoji = require('node-emoji');
const { DateTime } = require('luxon');
const { range } = require('./utils/helpers');
const { convertErrorToMsg } = require('./utils/messages');
const { getUserAndWallet } = require('./utils/getUserAndWallet');
const debug = require('debug')('tasks')

/**
 * @name DrawBuffer.getNewestDraw()
 * @description Read newest Draws from DrawBuffer
 */
 task("getDraw", "Read Draw from DrawBuffer")
 .addParam('id')
 .setAction(async (args, {ethers}) => {
    const drawBuffer = await ethers.getContract('DrawBuffer')
    convertDrawToTable(await drawBuffer.getDraw(args.id), drawBuffer.address)
 });

/**
 * @name DrawBuffer.getNewestDraw()
 * @description Read newest Draws from DrawBuffer
 */
 task("getNewestDraw", "Read newest Draws from DrawBuffer")
 .setAction(async (args, {ethers}) => {
    const drawBuffer = await ethers.getContract('DrawBuffer')
    convertDrawToTable(await drawBuffer.getNewestDraw(), drawBuffer.address)
 });

 /**
 * @name DrawBuffer.getOldestDraw()
 * @description Read oldest Draws from DrawBuffer
 */
  task("getOldestDraw", "Read oldest Draws from DrawBuffer")
  .setAction(async (args, {ethers}) => {
     const drawBuffer = await ethers.getContract('DrawBuffer')
     convertDrawToTable(await drawBuffer.getOldestDraw(), drawBuffer.address)
  });

/**
 * @name DrawBuffer.getDraws()
 * @description Read list of Draws from DrawBuffer
 */
 task("getDrawList", "Read list of Draws from DrawBuffer")
 .addParam('ids')
 .setAction(async ({ids}, {ethers}) => {
    const drawBuffer = await ethers.getContract('DrawBuffer')
    const list = ids.split(',')
    const oldDraw = await drawBuffer.getOldestDraw()
    const newDraw = await drawBuffer.getNewestDraw()
    const expiredList = list.filter((id, idx) => { if(id < oldDraw.drawId || id > newDraw.drawId) return true} )
    if(expiredList.length > 0) {
      console.log(red(`Draw IDs expired: ${expiredList} `))
      console.log(red('Remove expired ID(s) from passed --ids param'))
      console.log(green(`Run ${cyan('yarn task getDrawList')} to fetch all active Draws\n`))
      return;
    }
    try {
      const drawList = await drawBuffer.getDraws(list)
      drawList.forEach(draw => convertDrawToTable(draw, drawBuffer.address))
      return drawList;
    } catch (error) {
      convertErrorToMsg(error, drawBuffer)
    }
 });

/**
 * @name getLiveDraws()
 * @description Reads the curren draws range and reads list of Draws
 */
 task("getLiveDraws", "Read live DrawBuffer draw range")
 .setAction(async (args, {ethers}) => {
    const drawBuffer = await ethers.getContract('DrawBuffer')
    const oldDraw = await drawBuffer.getOldestDraw()
    const newDraw = await drawBuffer.getNewestDraw()
    const listEnforced = range((newDraw.drawId - oldDraw.drawId), oldDraw.drawId) // Generate Draw.drawId list [1,2,4,5,6,7]
    try {
      const drawList = await drawBuffer.getDraws(listEnforced)
      drawList.forEach(draw => convertDrawToTable(draw, drawBuffer.address));
      return drawList;
    } catch (error) {
      convertErrorToMsg(error, drawBuffer)
    }
 });

 /**
 * @name DrawBuffer.pushDraw()
 * @description Push Draw onto DrawBuffer ring buffer
  */
  task("pushDraw", "Set Draws in DrawBuffer")
  .addParam('id')
  .addParam('time')
  .addParam('wrn')
  .addParam('startedAt')
  .setAction(async (args, {ethers}) => {
    const { user, wallet } = await getUserAndWallet(ethers, args)
    debug(user, wallet)
    const { id, time, wrn, startedAt } = args
    debug(id, time, wrn, startedAt)
    const drawBuffer = await (await ethers.getContract('DrawBuffer').connect(wallet))
    const drawBeacon = await ethers.getContract('DrawBeacon')
    const beaconPeriodSeconds = await drawBeacon.beaconPeriodSeconds();
    try {
      const newDraw = {
        drawId: id,
        timestamp: time,
        winningRandomNumber: wrn,
        beaconPeriodStartedAt: startedAt,
        beaconPeriodSeconds: beaconPeriodSeconds
      }
      const tx = await drawBuffer.pushDraw(newDraw);
      console.log(cyan(emoji.get('checkmark'), 'Draw Pushed'))
      return tx
    } catch (error) {
      convertErrorToMsg(error, drawBuffer)
    }
  });

 /**
 * @name DrawBuffer.setDraw()
 * @description Set Draws in DrawBuffer
  */
  task("setDraw", "Set Draws in DrawBuffer")
  .addParam('id')
  .addParam('timestamp')
  .addParam('wrn')
  .setAction(async (args, {ethers}) => {
    const { user, wallet } = await getUserAndWallet(ethers, args)
    debug(user, wallet)
    const { id, timestamp, winningRandomNumber} = args
    debug(id, timestamp, winningRandomNumber)
    const drawBuffer = await( await ethers.getContract('DrawBuffer').connect(wallet))
    try {
      const drawCurrent = await drawBuffer.getDraw(id)
      const newDraw = {
        drawId: id,
        timestamp: timestamp || drawCurrent.timestamp,
        winningRandomNumber: winningRandomNumber || drawCurrent.winningRandomNumber,
        beaconPeriodStartedAt: drawCurrent.beaconPeriodStartedAt,
        beaconPeriodSeconds: drawCurrent.beaconPeriodSeconds,
      }
      const tx = await drawBuffer.setDraw(newDraw);
      console.log(cyan(emoji.get('checkmark'), 'Draw Set'))
      return tx
    } catch (error) {
      convertErrorToMsg(error, drawBuffer)
    }
  });


 function convertDrawToTable (draw, address) {
  console.log('----------------------------------------------------------------------------')
  console.log('Draw ID:', draw.drawId, `retrieved from ${address}`)
  console.log('----------------------------------------------------------------------------')

  const date = DateTime.fromMillis(draw.timestamp * 1000);
  const calendar = date.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);

  console.log(green(`Timestamp: ${cyan(draw.timestamp)} (${red(calendar)}) `))
  console.log(green(`RandomNumber: ${cyan(draw.winningRandomNumber)}`))
  console.log('------------------------------------------------------------------------------\n')
}