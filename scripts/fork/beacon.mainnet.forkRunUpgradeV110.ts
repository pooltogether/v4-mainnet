import hre from 'hardhat';
import impersonateNamedAccounts from './helpers/impersonateNamedAccounts';
import distributeEthToAccounts from './helpers/distributeEthToAccounts';
import actionIncreaseTimeAndStartCompleteDraw from './actions/actionIncreaseTimeAndStartCompleteDraw';
import executiveTeamUpdatingManagers from './upgrade/v1.1.0/executiveTeamUpdatingManagers';
import testBeaconTimelockAndPushRouterConfiguration from './upgrade/v1.1.0/testBeaconTimelockAndPushRouterConfiguration';

// Use PopulatedTransactions generated during the deploy/configuration steps.
import transactions from '../../deploy/v1.1.0/populatedTransactions.beacon.1.json';

/**
 * @name forkRunUpgradeV110
 * @description Simulates running the upgrade of Ethereum mainnet to version 1.1.0
 * @dev Start a fork and run the deploy/configure process before starting fork simulation.
 */
export async function forkRunUpgradeV110() {
  const chainId = await hre.getChainId();
  const { ptOperations } = await hre.getNamedAccounts();
  console.log('ChainID: ', chainId);
  impersonateNamedAccounts(ptOperations);
  await distributeEthToAccounts();

  /**
   * Set Management Roles
   * Updates PrizeDistributionBuffer.manager => PrizeDistributionFactory
   */
  executiveTeamUpdatingManagers(transactions.transactions, ptOperations);

  /**
   * Simulate Network Conditions after Contract/Role Upgrades
   * 1. Increase Time, Start Draw and Complete Draw
   * 2. Push Draw/NetworkTotalSupply to BeaconTimelock
   */
  actionIncreaseTimeAndStartCompleteDraw();
  testBeaconTimelockAndPushRouterConfiguration(ptOperations);
}

forkRunUpgradeV110();
