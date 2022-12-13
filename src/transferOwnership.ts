import { dim, cyan, green, red } from './colors';
import hardhat from 'hardhat';

const { ethers } = hardhat;

export async function transferOwnership(name, contract, desiredOwner) {
  if (!contract) {
    contract = await ethers.getContract(name);
  }

  const owner = await contract.owner();
  const deployer = (await hardhat.getNamedAccounts()).deployer;

  if (owner === deployer) {
    const ownerIsSet =
      (await contract.owner()) == desiredOwner || (await contract.pendingOwner()) == desiredOwner;

    if (!ownerIsSet) {
      cyan(`\nTransferring ${name} ownership to ${desiredOwner}...`);
      const tx = await contract.transferOwnership(desiredOwner);
      await tx.wait(1);
      green(`Transfer complete!`);
    } else {
      dim(`\nOwner for ${name} has been set`);
    }
  } else {
    red(
      `\nDeployer ${deployer} is not the owner of ${name} (${contract.address}). Please transfer ownership to the deployer before transferring ownership.`,
    );
    return;
  }
}
