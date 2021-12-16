import { cyan, green } from './colors'
import hardhat from 'hardhat'

const { ethers } = hardhat

export async function setTicket(ticketAddress, contract?) {
    if (!contract) {
        contract = await ethers.getContract('YieldSourcePrizePool')
    }
    if (await contract.getTicket() != ticketAddress) {
        cyan('\nSetting prize strategy on prize pool...')
        const tx = await contract.setTicket(ticketAddress)
        await tx.wait(1)
        green(`Set prize strategy!`)
    }
}
