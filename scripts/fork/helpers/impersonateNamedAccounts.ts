import chalk from 'chalk';
import hre from "hardhat";

async function impersonateNamedAccounts(accounts: Array<string>){
    console.log(chalk.dim("Impersonating Named Accounts"))
    for (let index = 0; index < accounts.length; index++) {
        const element = accounts[index];
        await hre.ethers.provider.send("hardhat_impersonateAccount",[element])
        console.log(chalk.green('Impersonated Accounts'))
        console.log( `Address: ${element}`)
        
    }

}

export default impersonateNamedAccounts