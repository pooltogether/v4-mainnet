import hre from "hardhat"
import { Contract, PopulatedTransaction } from "ethers";
import { ProviderOptions, ContractsBlob } from '../types'
import { getContract } from "../helpers/getContract";
import getJsonRpcProvider from "../helpers/getJsonRpcProvider";
import { calculateBeaconDrawToPushToTimelock, calculateDrawTimestamps } from "../helpers";
import getMultiTicketAverageTotalSuppliesBetween from "../helpers/get/getMultiTicketAverageTotalSuppliesBetween";
import { sumBigNumbers } from "../helpers/sumBigNumbers";
const debug = require('debug')('pt-autotask-lib');

export interface PrizePoolNetworkConfig {
    beaconChain: ProviderOptions;
    allPrizePoolNetworkChains: ProviderOptions[];
}
  
  export async function beaconDrawLockAndNetworkTotalSupplyPush(
    contracts: ContractsBlob,
    config: PrizePoolNetworkConfig
  ): Promise<PopulatedTransaction | undefined> {
    let providerBeaconChain;
  
    if (config?.beaconChain?.providerUrl) {
      providerBeaconChain = getJsonRpcProvider(config?.beaconChain?.providerUrl);
    }

    const { ptOperations, defenderRelayer } = await hre.getNamedAccounts()
    const signer = hre.ethers.provider.getUncheckedSigner(defenderRelayer)
  
  
    // TODO: throw error if no provider?
    if (!providerBeaconChain) {
      return undefined;
    }

    const drawBufferBeaconChain = await hre.ethers.getContract('DrawBuffer', signer);
    const prizeTierHistoryBeaconChain = await hre.ethers.getContract('PrizeTierHistory', signer);
    const prizeDistributionBufferBeaconChain = await hre.ethers.getContract('PrizeDistributionBuffer', signer);
    const beaconTimelockAndPushRouter = await hre.ethers.getContract('BeaconTimelockAndPushRouter', signer);
    const ticketBeaconChain = await hre.ethers.getContract('Ticket', signer);
  
    // TODO: throw error if any of the contracts is unavailable?
    if (
      !drawBufferBeaconChain ||
      !prizeTierHistoryBeaconChain ||
      !prizeDistributionBufferBeaconChain ||
      !beaconTimelockAndPushRouter ||
      !ticketBeaconChain
    ) {
      throw new Error('Smart Contracts are unavailable');
    }
  
    //  Initialize Secondary ReceiverChain contracts
    let otherTicketContracts:
      | Array<Contract | undefined>
      | undefined = []

    for (let index = 0; index < config.allPrizePoolNetworkChains.length; index++) {
        let otherTicket = config.allPrizePoolNetworkChains[index];
        const contract = await getContract(
          'Ticket',
          otherTicket.chainId,
          getJsonRpcProvider(otherTicket.providerUrl),
          contracts
        );
        otherTicketContracts.push(contract)
    }
      
    const {
      lockAndPush,
      drawIdToFetch,
    } = await calculateBeaconDrawToPushToTimelock(
      drawBufferBeaconChain,
      prizeDistributionBufferBeaconChain
    );
    if (lockAndPush) {
      let drawFromBeaconChainToPush;
      drawFromBeaconChainToPush = await drawBufferBeaconChain.getDraw(
        drawIdToFetch
      );
      const prizeTier = await prizeTierHistoryBeaconChain.getPrizeTier(
        drawIdToFetch
      );
      const [startTime, endTime] = calculateDrawTimestamps (
        prizeTier,
        drawFromBeaconChainToPush
      );
      const allTicketAverageTotalSupply = await getMultiTicketAverageTotalSuppliesBetween(
        otherTicketContracts,
        startTime,
        endTime
      );
      debug('allTicketAverageTotalSupply', allTicketAverageTotalSupply);
  
      if (
        !allTicketAverageTotalSupply ||
        allTicketAverageTotalSupply.length === 0
      ) {
        throw new Error('No ticket data available');
      }
  
      const totalNetworkTicketSupply = sumBigNumbers(allTicketAverageTotalSupply);
  
      console.log('Draw: ', drawFromBeaconChainToPush);
      console.log('TotalNetworkSupply: ', totalNetworkTicketSupply);
      console.log(await beaconTimelockAndPushRouter.owner())
      console.log("Manager: ", await beaconTimelockAndPushRouter.manager())

      return await beaconTimelockAndPushRouter.populateTransaction.push(
        drawFromBeaconChainToPush,
        totalNetworkTicketSupply
      );

    } else {
      console.log('No Draw to lock and push');
      return undefined;
    }
  }

  export default beaconDrawLockAndNetworkTotalSupplyPush