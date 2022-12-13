import { dim, cyan, green, red } from './colors';
import hardhat from 'hardhat';

const { ethers } = hardhat;

export async function setDrawCalculator(drawCalculatorAddress: string) {
  const contract = await ethers.getContract('PrizeDistributor');
  const owner = await contract.owner();
  const deployer = (await hardhat.getNamedAccounts()).deployer;
  if (owner === deployer) {
    cyan(`\nSetting PrizeDistributor DrawCalculator to ${drawCalculatorAddress}`);
    const tx = await contract.setDrawCalculator(drawCalculatorAddress);
    await tx.wait(1);
    green(`DrawCalculator set to ${drawCalculatorAddress}`);
  } else {
    red(
      `\nDeployer ${deployer} is not owner of PrizeDistributor ${contract.address}. Owner is ${owner}.`,
    );
  }
}
