const { dim, cyan, green } = require("./colors")

async function transferOwnership(name, contract, desiredOwner) {
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

module.exports = {
    transferOwnership
}