import hre from "hardhat"
import contractsBlob from '../../../../mainnet.json';
import beaconDrawLockAndNetworkTotalSupplyPush from '../../actions/beaconDrawLockAndNetworkTotalSupplyPush'

async function testBeaconTimelockAndPushRouterConfiguration(ptOperations: string) {
    const config = {
        beaconChain: {
          chainId: 1,
          providerUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
        },
        allPrizePoolNetworkChains: [
          {
            chainId: 137,
            providerUrl: `https://polygon-mainnet.infura.io/v3/b81e24d29d1942b8bf04bf3c81ae3761`,
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