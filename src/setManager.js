const { dim, cyan, green } = require('./colors')

async function setManager(name, contract, manager) {
    if (await contract.manager() != manager) {
        cyan(`\nSetting ${name} manager`)
        const tx = await contract.setManager(manager)
        await tx.wait(1)
        green(`Manager set to ${manager}!`)
    } else {
        dim(`\nManager for ${name} already set to ${manager}`)
    }
}

module.exports = {
    setManager
}
