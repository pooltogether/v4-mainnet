import { PopulatedTransaction } from "ethers";
import hre from "hardhat";

async function executiveTeamUpdatingManagers(transactions: Array<PopulatedTransaction>, ptOperations: string){
    for (let index = 0; index < transactions.length; index++) {
        let transaction = transactions[index]
        const signer = hre.ethers.provider.getUncheckedSigner(ptOperations)
        transaction.from = signer._address;
        const tx = await signer.sendTransaction(transaction)
        await tx.wait(1)
    }
    console.log("Simulation: Executive Team Updated Manage Roles")
}

export default executiveTeamUpdatingManagers