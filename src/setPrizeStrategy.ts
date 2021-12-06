import { dim, cyan, green } from './colors'
import hardhat from 'hardhat'

const { ethers } = hardhat

export async function setPrizeStrategy(prizeStrategyAddress, contract?) {
    if (!contract) {
        contract = await ethers.getContract('YieldSourcePrizePool')
    }
    if (await contract.getPrizeStrategy() != prizeStrategyAddress) {
        cyan('\nSetting prize strategy on prize pool...')
        const tx = await contract.setPrizeStrategy(prizeStrategyAddress)
        await tx.wait(1)
        green(`Set prize strategy!`)
    }
}
