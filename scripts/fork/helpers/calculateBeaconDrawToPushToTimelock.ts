import { Contract } from '@ethersproject/contracts';

export async function calculateBeaconDrawToPushToTimelock(
  drawBufferBeaconChain: Contract,
  prizeDistributionBufferBeaconChain: Contract
) {
  let drawIdToFetch;
  let drawNewestFromBeaconChain;
  let lockAndPush: Boolean = false;
  let newestPrizeDistributionDrawId = 0;
  try {
    drawNewestFromBeaconChain = await drawBufferBeaconChain.getNewestDraw();
  } catch (error) {
    throw new Error('BeaconChain: DrawBuffer is not initialized');
  }

  try {
    const {
      drawId,
    } = await prizeDistributionBufferBeaconChain.getNewestPrizeDistribution();
    if (drawId > 0) {
      newestPrizeDistributionDrawId = drawId;
    }
  } catch (error) {
    throw new Error('BeaconChain: PrizeDistributionBuffer is not initialized');
  }

  console.log('DrawBuffer:newestDraw: ', drawNewestFromBeaconChain);
  console.log(
    'PrizeDistributionBuffer:newestPrizeDistributionDrawId: ',
    newestPrizeDistributionDrawId
  );

  if (newestPrizeDistributionDrawId < drawNewestFromBeaconChain.drawId) {
    lockAndPush = true;
    drawIdToFetch = newestPrizeDistributionDrawId + 1;
  }

  return {
    lockAndPush,
    drawIdToFetch,
  };
}
