import hre from "hardhat";
import impersonateNamedAccounts from './helpers/impersonateNamedAccounts'
import executiveTeamUpdatingManagers from './upgrade/v1.1.0/executiveTeamUpdatingManagers'
import transactions from '../../deploy/v1.1.0/populatedTransactions.beacon.1.json'
export async function forkRunUpgradeV110(){
    const chainId = await hre.getChainId()
    const { executiveTeam } = await hre.getNamedAccounts()
    console.log("ChainID: ", chainId)
    impersonateNamedAccounts(executiveTeam)
    executiveTeamUpdatingManagers(transactions.transactions, executiveTeam)
}
forkRunUpgradeV110()