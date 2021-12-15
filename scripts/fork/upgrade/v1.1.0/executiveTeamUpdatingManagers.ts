import { PopulatedTransaction } from "ethers";
import hre from "hardhat";

async function executiveTeamUpdatingManagers(transactions: Array<PopulatedTransaction>, executiveTeam: string){
    for (let index = 0; index < transactions.length; index++) {
        let transaction = transactions[index]
        const signer = await hre.ethers.provider.getUncheckedSigner(executiveTeam)
        transaction.from = signer._address;
        const tx = await signer.sendTransaction(transaction)
        await tx.wait(1)
    }
    console.log("Simulation: Executive Team Updated Manage Roles")
}

export default executiveTeamUpdatingManagers