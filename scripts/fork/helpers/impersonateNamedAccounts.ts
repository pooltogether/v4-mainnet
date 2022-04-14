import chalk from 'chalk';
import hre from "hardhat";

async function impersonateNamedAccounts(account: string){
    console.log(chalk.dim("Impersonating Named Accounts"))
    await hre.ethers.provider.send("hardhat_impersonateAccount",[account])
    console.log( `Now impersonating ${account} for all transactions`)
}

export default impersonateNamedAccounts