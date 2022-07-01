export const external = {
  contracts: [
    {
      artifacts: 'node_modules/@pooltogether/pooltogether-rng-contracts/build',
    },
    {
      artifacts: 'node_modules/@pooltogether/yield-source-interface/artifacts',
    },
    {
      artifacts: 'node_modules/@pooltogether/v4-periphery/artifacts',
    },
  ],
  deployments: {
    mainnet: ['node_modules/@pooltogether/pooltogether-rng-contracts/deployments/mainnet'],
    polygon: ['node_modules/@pooltogether/pooltogether-rng-contracts/deployments/matic_137'],
  },
};
export const dependencyCompiler = {
  paths: [
    // Core
    '@pooltogether/v4-core/contracts/DrawBeacon.sol',
    '@pooltogether/v4-core/contracts/DrawCalculator.sol',
    '@pooltogether/v4-core/contracts/DrawBuffer.sol',
    '@pooltogether/v4-core/contracts/PrizeDistributor.sol',
    '@pooltogether/v4-core/contracts/PrizeDistributionBuffer.sol',
    '@pooltogether/v4-core/contracts/Ticket.sol',
    '@pooltogether/v4-core/contracts/prize-strategy/PrizeSplitStrategy.sol',
    '@pooltogether/v4-core/contracts/Reserve.sol',
    '@pooltogether/v4-core/contracts/prize-pool/YieldSourcePrizePool.sol',
    '@pooltogether/v4-core/contracts/permit/EIP2612PermitAndDeposit.sol',
    // Owner/Manager
    '@pooltogether/owner-manager-contracts/contracts/Manageable.sol',
    '@pooltogether/owner-manager-contracts/contracts/Ownable.sol',
    // Timelock
    '@pooltogether/v4-timelocks/contracts/L1TimelockTrigger.sol',
    '@pooltogether/v4-timelocks/contracts/L2TimelockTrigger.sol',
    '@pooltogether/v4-timelocks/contracts/DrawCalculatorTimelock.sol',
    '@pooltogether/v4-timelocks/contracts/BeaconTimelockTrigger.sol',
    '@pooltogether/v4-timelocks/contracts/ReceiverTimelockTrigger.sol',
    // TWAB Delegator
    '@pooltogether/v4-twab-delegator/contracts/TWABDelegator.sol',
    // YieldSource
    '@pooltogether/aave-yield-source/contracts/yield-source/ATokenYieldSource.sol',
    '@pooltogether/aave-v3-yield-source/contracts/AaveV3YieldSource.sol',
    // Chainlink VRF
    '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol',
    // RNG Service
    '@pooltogether/pooltogether-rng-contracts/contracts/RNGChainlinkV2.sol',
  ],
};
