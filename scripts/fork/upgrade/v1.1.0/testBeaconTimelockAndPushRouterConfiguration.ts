import hre from "hardhat"
import contractsBlob from '../../../../contracts.json';
import beaconDrawLockAndNetworkTotalSupplyPush from '../../actions/beaconDrawLockAndNetworkTotalSupplyPush'

async function testBeaconTimelockAndPushRouterConfiguration(ptOperations: string) {
    const config = {
        beaconChain: {
          chainId: 1,
          providerUrl: process.env.MAINNET_RPC_URL,
        },
        allPrizePoolNetworkChains: [
          {
            chainId: 137,
            providerUrl: process.env.POLYGON_RPC_URL,
          },
          // {
          //   chainId: 43114,
          //   providerUrl: `https://api.avax.network/ext/bc/C/rpc`,
          // }
        ],
      };
  
      const transaction = await beaconDrawLockAndNetworkTotalSupplyPush(
        contractsBlob,
        config
      );
      const signer = hre.ethers.provider.getUncheckedSigner(ptOperations)
      transaction.from = ptOperations
      console.log('BeaconTimelockAndPushRouter: Pushing New Draw and NetworkTotalSupply')
      try {
        await signer.sendTransaction(transaction)
        console.log('BeaconTimelockAndPushRouter: Complete')
      } catch (error) {
        console.log('BeaconTimelockAndPushRouter: ERROR')
        console.log(error)
      }
}

export default testBeaconTimelockAndPushRouterConfiguration