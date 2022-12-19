import * as hre from 'hardhat';
import { dim, green, yellow } from '../src/colors';
import { deployAndLog } from '../src/deployAndLog';

/**
 * Deploys an instance of EIP2612PermitAndDeposit on the specified chain.
 */
async function migrate() {
  dim(`Starting...`);
  const network = hre.network.name;
  const { getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  dim(`Deployer: ${deployer}`);
  dim(`Network : ${network}`);
  await deployAndLog('EIP2612PermitAndDeposit', { from: deployer, skipIfAlreadyDeployed: true });
  green('Done!');
}

async function run() {
  try {
    await migrate();
  } catch (e) {
    yellow('Error deploying EIP2612PermitAndDeposit');
    throw e;
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
