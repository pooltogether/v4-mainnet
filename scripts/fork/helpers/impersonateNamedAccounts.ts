import chalk from 'chalk';
import hre from "hardhat";

async function impersonateNamedAccounts(ptOperations: string){
    console.log(chalk.dim("Impersonating Named Accounts"))
    await hre.ethers.provider.send("hardhat_impersonateAccount",[ptOperations])
    console.log(chalk.green('Impersonated accounts'))
    console.log( `Executive Team: ${ptOperations}`)
}

export default impersonateNamedAccounts