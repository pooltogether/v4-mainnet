import { dim, cyan, green } from './colors'
import hardhat from 'hardhat'

const { ethers } = hardhat

export async function setManager(name, contract, manager) {
    if (!contract) {
        contract = await ethers.getContract(name)
    }
    if (await contract.manager() != manager) {
        cyan(`\nSetting ${name} manager`)
        const tx = await contract.setManager(manager)
        await tx.wait(1)
        green(`Manager set to ${manager}`)
    } else {
        dim(`\nManager for ${name} already set to ${manager}`)
    }
}
