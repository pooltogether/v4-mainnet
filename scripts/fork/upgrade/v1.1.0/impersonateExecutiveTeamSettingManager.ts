import chalk from 'chalk';
import hre from "hardhat";
import config from '../../../../hardhat.config';

async function run(){
    await hre.ethers.provider.send("hardhat_impersonateAccount",[config.namedAccounts.executiveTeam])
    console.log(chalk.green('Impersonated accounts'))
}

run()