import hardhat from 'hardhat';
import { green, yellow } from '../colors';
import { END_TIMESTAMP_OFFSET, EXPIRY_DURATION } from '../constants';

const { ethers } = hardhat;

export async function pushDraw266() {
  yellow(`\nPushing Prize Tier configuration for Draw 48 onto the Prize Tier History...`);
  const prizeTierHistory = await ethers.getContract('PrizeTierHistory');
  const pushTx = await prizeTierHistory.push({
    drawId: 266,
    bitRangeSize: 2,
    maxPicksPerUser: 1,
    endTimestampOffset: END_TIMESTAMP_OFFSET,
    prize: '4732000000',
    tiers: ['300084531', 0, 0, '699915469', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    expiryDuration: EXPIRY_DURATION,
  });
  await pushTx.wait(1);
  green(`Done!`);
}
