const hardhat = require('hardhat');
const blessed = require('blessed');
const getDashboardAreas = require('./getDashboardAreas');

// Views
const { DrawBufferTable } = require('./views/DrawBufferTable');
const { ContractAddresses } = require('./views/ContractAddresses');
const { TicketDetails } = require('./views/TicketDetails');
const { DrawBeaconDetails } = require('./views/DrawBeaconDetails');
const { ManagementOvervew } = require('./views/ManagementOvervew');
const { ContractTree } = require('./views/ContractTree');

// Fetch Data
const { getContractAddresses } = require('../fetch/getContractAddresses')
const { getTicketDetails } = require('../fetch/getTicketDetails')
const { getDrawBufferAndPrizeDistributionBuffer } = require('../fetch/getDrawBufferAndPrizeDistributionBuffer');
const { ethers } = require('hardhat');
const { getDrawBeaconDetails } = require('../fetch/getDrawBeaconDetails');

async function main(data) {
  const SCREEN = blessed.screen({smartCSR: true});  
  SCREEN.title = 'PoolTogether V4 Admin Terminal Dashboard';

  const {areaTopLeft, areaTopCenterRowFirst, areaTopCenterRowSecond, areaTopRight, areaBottomLeft, areaBottomRight } = getDashboardAreas()
  
  /* ================================================ */
  // Create Areas
  /* ================================================ */
  SCREEN.append(areaTopLeft);
  SCREEN.append(areaTopCenterRowFirst);
  SCREEN.append(areaTopCenterRowSecond);
  SCREEN.append(areaTopRight);
  SCREEN.append(areaBottomLeft);
  SCREEN.append(areaBottomRight);

  /* ================================================ */
  // Create views from Data
  /* ================================================ */
  // Top Left
  const drawBufferTable = DrawBufferTable(areaTopLeft)

  // Top Center
  const ticketDetails = TicketDetails(data.ticket, data.user)
  const drawBeaconDetails = DrawBeaconDetails(data.drawBeacon, data, {})
  
  // Top Right
  const contractAddresses = ContractAddresses(data.contracts)
  
  const managementOvervew = ManagementOvervew(data.contracts, data)
  const contractTree = ContractTree(SCREEN)

  /* ================================================ */
  // Assign Views to Areas
  /* ================================================ */
  areaTopLeft.append(drawBufferTable)
  areaTopRight.append(contractAddresses)
  areaTopCenterRowFirst.append(ticketDetails)
  areaTopCenterRowSecond.append(drawBeaconDetails)
  areaBottomLeft.append(managementOvervew)
  areaBottomRight.append(contractTree)
  
  // Date Setting
  updateTable(drawBufferTable, data)
  
  /* ================================================ */
  // Handle Focus and Exiting Program
  /* ================================================ */

  // Quit on Escape, q, or Control-C.
  SCREEN.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
  });
  SCREEN.render();

}

async function data() {
  const [wallet] = await ethers.getSigners()
  const contracts = await getContractAddresses();
  const ticket = await getTicketDetails();
  const drawBeacon = await getDrawBeaconDetails();

  const {
    deployer,
    manager
  } = await hardhat.getNamedAccounts();

  // READ DrawBuffer and lnked PrizeDistribution parameters 
  const [ draws, prizeDistribtuion] = await getDrawBufferAndPrizeDistributionBuffer(hardhat.ethers)
  const drawsAndPrizeDistribution = draws.map((draw, idx) => convertDataToTableArray(draw, prizeDistribtuion[idx]))

  // Construct Data for Dashboard Views
  const data = {
    user: wallet.address,
    contracts,
    drawBeacon,
    ticket,
    drawsAndPrizeDistribution,
    manager,
    deployer
  }

  main(data)
}

function convertDataToTableArray(draw, prizeDistribution) {
  return [
    draw.drawId, 
    draw.timestamp, 
    prizeDistribution.numberOfPicks, 
    `${ethers.utils.formatEther(prizeDistribution.prize)}`, 
    `${prizeDistribution.bitRangeSize}`, 
    `${prizeDistribution.matchCardinality}`,
    `${prizeDistribution.maxPicksPerUser}`,
    `${prizeDistribution.endTimestampOffset}`
  ]
}

function updateTable(table, data) {
  table.setData(
    { headers: ['DrawID', 'Timestamp', 'Picks', 'Max Picks', 'Prize', 'Bitrange', 'Cardinality', 'End Sec(s)']
    , data:data.drawsAndPrizeDistribution })

}

data()

module.exports = {
  dashboard: main
}