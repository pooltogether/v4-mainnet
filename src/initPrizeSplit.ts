import hardhat from 'hardhat'
import { cyan, green } from './colors'

const { ethers } = hardhat

export async function initPrizeSplit() {
    const prizeSplitStrategy = await ethers.getContract('PrizeSplitStrategy')
    if (!prizeSplitStrategy) { throw new Error('Missing PrizeSplitStrategy')}
    const reserve = await ethers.getContract('Reserve')
    if (!reserve) { throw new Error('Missing Reserve')}
    if ((await prizeSplitStrategy.getPrizeSplits()).length == 0) {
      cyan('\nAdding 100% reserve prize split...')
      const tx = await prizeSplitStrategy.setPrizeSplits([
        { target: reserve.address, percentage: 1000 }
      ])
      await tx.wait(1)
      green('Done!')
    }
}
