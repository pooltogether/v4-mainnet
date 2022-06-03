# PoolTogether V4 Mainnet

The PoolTogether V4 "mainnet" deployment scripts.

The deployment scripts are separated into versions.

- v1.0.1
- v1.1.0
- v1.2.1
- v1.3.0

# Getting Started

Install `direnv` module.

We use [direnv](https://direnv.net/) to manage environment variables.  You'll likely need to install it.

```sh
cp .envrc.example .envrc
```

The RPC endpoints will need to be updated if you wish to deploy.  The RPC endpoints will also need to point to archival nodes if you wish to run fork tests.

```.sh
yarn
```

# Development

The deployment scripts can be tested in forked environments.  The following commands will fork the network then run the deployment script against the fork.

Note: You must configure RPC endpoints for archival nodes in the .envrc.

## Fork and Deploy

```
yarn test:v1.x.x.mainnet
```

```
yarn test:v1.x.x.avalanche
```

```
yarn test:v1.x.x.polygon
```

# Deployment

```
yarn deploy:v1.x.x.mainnet
```

```
yarn deploy:v1.x.x.avalanche
```

```
yarn deploy:v1.x.x.polygon
```

# Changelog

## v1.0.1

This version was the original V4 launch across Ethereum and Polygon.

## v1.1.0

This version launched V4 on Avalanche, and included upgrades to Ethereum and Polygon.  New contracts are being deployed across Avalanche, Ethereum and Polygon.

This version upgrades the existing configuration, so some changes need to be completed by the PoolTogether Executive Team once the contracts have been launched.  Those post-deploy configuration changes are detailed below.

### v1.1.0 Post-Deploy Configuration Changes

#### Polygon

1. Set the PrizeDistributionBuffer manager to be the new PrizeDistributionFactory
2. Set the DrawCalculatorTimelock manager to be the ReceiverTimelockTrigger
3. Set the DrawBuffer to be managed by the ReceiverTimelockTrigger
4. exec team needs to claim ownership of PrizeDistributionFactory
5. exec team needs to claim ownership of ReceiverTimelockTrigger
6. exec team needs to claim ownership of PrizeTierHistory

#### Mainnet

- exec team needs to claim ownership of PrizeDistributionFactory
- exec team needs to claim ownership of BeaconTimelockTrigger
- PrizeDistributionBuffer needs to be managed by the PDFactory
- DrawCalculatorTimelock needs to be managed by the BeaconTimelockTrigger

#### Avalanche

- exec teams needs to claim ownership of PrizeDistributionFactory
- exec teams needs to claim ownership of DrawCalculatorTimelock
- exec teams needs to claim ownership of PrizeFlush
- exec teams needs to claim ownership of Reserve
- exec teams needs to claim ownership of YieldSourcePrizePool
- exec teams needs to claim ownership of PrizeTierHistory
- exec teams needs to claim ownership of PrizeSplitStrategy
- exec teams needs to claim ownership of DrawBuffer
- exec teams needs to claim ownership of PrizeDistributionBuffer
- exec teams needs to claim ownership of ReceiverTimelockTrigger

## v1.2.1

Deploy TWAB Rewards contract across Avalanche, Ethereum and Polygon.

## v1.3.0

Deploy TWAB Delegator contract across Avalanche, Ethereum and Polygon.

## v1.4.0

Deploy new BeaconTimelockTrigger, DrawCalculatorTimelock, PrizeDistributionFactory and PrizeTierHistory contracts on Ethereum.

Deploy new DrawCalculatorTimelock, PrizeDistributionFactory, PrizeTierHistory and ReceiverTimelockTrigger contracts on Avalanche and Polygon.

## v1.5.0

Deploy RNGChainlinkV2 on Ethereum.

## v1.5.1

Redeploy TWABRewards on Avalanche, Ethereum and Polygon.

