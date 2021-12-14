import chalk from 'chalk';
import hre from "hardhat";
import namedAccounts from '../../hardhat.config.namedAccounts';

async function run(){
    console.log(chalk.dim("Impersonating accounts..."))
    await hre.ethers.provider.send("hardhat_impersonateAccount",[namedAccounts.executiveTeam])
    console.log(chalk.green('Impersonated accounts'))
}

run()