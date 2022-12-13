import { dim, cyan, green, red } from './colors';
import hardhat from 'hardhat';

const { ethers } = hardhat;

export async function setManager(name, contract, manager) {
  if (!contract) {
    contract = await ethers.getContract(name);
  }

  const owner = await contract.owner();
  const deployer = (await hardhat.getNamedAccounts()).deployer;

  if (owner === deployer) {
    if ((await contract.manager()) != manager) {
      cyan(`\nSetting ${name} manager`);
      const tx = await contract.setManager(manager);
      await tx.wait(1);
      green(`Manager set to ${manager}`);
    } else {
      dim(`\nManager for ${name} already set to ${manager}`);
    }
  } else {
    red(
      `\nDeployer ${deployer} is not the owner of ${name} (${contract.address}). Please transfer ownership to the deployer before setting the manager.`,
    );
  }
}
