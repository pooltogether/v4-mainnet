// @ts-nocheck
import { task } from "hardhat/config";
import { getUserAndWallet } from './utils/getUserAndWallet';

/**
 * @name Manageable.setManager()
 */
 task("Manageable.setManager", "")
 .addOptionalParam("contract", "<address>")
 .addOptionalParam("user", "<address>")
 .addOptionalParam("wallet", "<address>")
 .setAction(async (args, hre) => {
     const { user, wallet } = await getUserAndWallet(hre.ethers, args)
     const manageable = await hre.ethers.getContractAt('Manageable', args.contract, wallet)
    // const manageable = await contractConnectWallet(hre.ethers, 'Manageable', wallet)
    const tx = await manageable.setManager(user)
    return tx
 });