import { dim, cyan, green } from './colors'
import hardhat from 'hardhat'

const { ethers } = hardhat

export async function transferOwnership(name, contract, desiredOwner) {
    if (!contract) {
        contract = await ethers.getContract(name)
    }
    const ownerIsSet = (
        await contract.owner() == desiredOwner ||
        await contract.pendingOwner() == desiredOwner
    )

    if (!ownerIsSet) {
        cyan(`\nTransferring ${name} ownership to ${desiredOwner}...`)
        const tx = await contract.transferOwnership(desiredOwner)
        await tx.wait(1)
        green(`Transfer complete!`)
    } else {
        dim(`\nOwner for ${name} has been set`)
    }
}
