// @ts-nocheck
import { task } from "hardhat/config";
import { getUserAndWallet } from './utils/getUserAndWallet';

/**
 * @name Manageable.setManager()
 */
 task("Manageable.setManager", "")
 .addOptionalParam("contract", "<address>")
 .addOptionalParam("manager", "<address>")
 .addOptionalParam("wallet", "<address>")
 .setAction(async (args, hre) => {
     const { manager, wallet } = await getUserAndWallet(hre.ethers, args)
     const manageable = await hre.ethers.getContractAt('Manageable', args.contract, wallet)
    return await manageable.setManager(manager)
 });