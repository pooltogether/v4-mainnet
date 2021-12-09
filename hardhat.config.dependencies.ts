export const external = {
  contracts: [
    {
      artifacts: "node_modules/@pooltogether/pooltogether-rng-contracts/build",
    },
    {
      artifacts: "node_modules/@pooltogether/yield-source-interface/artifacts"
    }
  ],
  deployments: {
    mainnet: ["node_modules/@pooltogether/pooltogether-rng-contracts/deployments/mainnet"],
    polygon: ["node_modules/@pooltogether/pooltogether-rng-contracts/deployments/matic_137"],
  },
}
export const dependencyCompiler = {
  paths: [
    // Core
    "@pooltogether/v4-core/contracts/DrawBeacon.sol",
    "@pooltogether/v4-core/contracts/DrawCalculator.sol",
    "@pooltogether/v4-core/contracts/DrawBuffer.sol",
    "@pooltogether/v4-core/contracts/PrizeDistributor.sol",
    "@pooltogether/v4-core/contracts/PrizeDistributionBuffer.sol",
    "@pooltogether/v4-core/contracts/Ticket.sol",
    "@pooltogether/v4-core/contracts/prize-strategy/PrizeSplitStrategy.sol",
    "@pooltogether/v4-core/contracts/Reserve.sol",
    "@pooltogether/v4-core/contracts/prize-pool/YieldSourcePrizePool.sol",
    "@pooltogether/v4-core/contracts/test/ERC20Mintable.sol",
    // Timelock
    "@pooltogether/v4-timelocks/contracts/L1TimelockTrigger.sol",
    "@pooltogether/v4-timelocks/contracts/L2TimelockTrigger.sol",
    "@pooltogether/v4-timelocks/contracts/DrawCalculatorTimelock.sol",
    "@pooltogether/v4-timelocks/contracts/BeaconTimelockAndPushRouter.sol",
    "@pooltogether/v4-timelocks/contracts/ReceiverTimelockAndPushRouter.sol",
    // Periphery
    "@pooltogether/v4-periphery/contracts/PrizeFlush.sol",
    "@pooltogether/v4-periphery/contracts/PrizeTierHistory.sol",
    "@pooltogether/v4-periphery/contracts/PrizeDistributionFactory.sol",
    // yield source
    "@pooltogether/aave-yield-source/contracts/yield-source/ATokenYieldSource.sol"
  ]
}