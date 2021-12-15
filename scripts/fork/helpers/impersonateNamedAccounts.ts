import chalk from 'chalk';
import hre from "hardhat";
import config from '../../../hardhat.config';

async function impersonateNamedAccounts(executiveTeam: string){
    console.log(chalk.dim("Impersonating Named Accounts"))
    await hre.ethers.provider.send("hardhat_impersonateAccount",[executiveTeam])
    console.log(chalk.green('Impersonated accounts'))
    console.log( `Executive Team: ${executiveTeam}`)
}

export default impersonateNamedAccounts