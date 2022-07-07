import { cyan, green } from './colors'
import hardhat from 'hardhat'

const { ethers } = hardhat

type Timelock = {
    timestamp: number,
    drawId: number,
}

export async function setTimelock(timelock: Timelock, contract?) {
    if (!contract) {
        contract = await ethers.getContract('DrawCalculatorTimelock')
    }

    if (await contract.getTimelock() != timelock) {
        cyan('\nSetting timelock on DrawCalculatorTimelock...')
        const tx = await contract.setTimelock(timelock)
        await tx.wait(1)
        green(`Timelock set!`)
    }
}
