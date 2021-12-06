import { Contract } from "@ethersproject/contracts"

const { dim, cyan, green } = require("./colors")

export async function transferOwnership(name: string, contract: Contract, desiredOwner: string) {
    const ownerIsSet = (
        await contract.owner() == desiredOwner ||
        await contract.pendingOwner() == desiredOwner
    )

    if (!ownerIsSet) {
        cyan(`\nTransferring ${name} ownership...`)
        const tx = await contract.transferOwnership(desiredOwner)
        await tx.wait(1)
        green(`Transfer complete!`)
    } else {
        dim(`\nOwner for ${name} has been set`)
    }
}

export default transferOwnership