# PoolTogether V4 Mainnet

The PoolTogether V4 "mainnet" deployment scripts.

The deployment scripts are separated into versions.

- v1.0.1
- v1.1.0

## v1.0.1

This version was the original V4 launch across Ethereum and Polygon.

## v1.1.0

This version launched V4 on Avalanche, and included upgrades to Ethereum and Polygon. 

**Post-Deploy Configuration Changes**

### Polygon

- exec team needs to claim ownership of PrizeDistributionFactory
- exec team needs to claim ownership of ReceiverTimelockTrigger
- exec team needs to claim ownership of PrizeTierHistory
- PrizeDistributionBuffer needs to be managed by the PDFactory
- DrawCalculatorTimelock needs to be managed by the ReceiverTimelockTrigger
- DrawBuffer to be managed by the ReceiverTimelockTrigger

### Mainnet

- exec team needs to claim ownership of PrizeDistributionFactory
- exec team needs to claim ownership of BeaconTimelockTrigger
- PrizeDistributionBuffer needs to be managed by the PDFactory
- DrawCalculatorTimelock needs to be managed by the BeaconTimelockTrigger

### Avalanche

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


# Getting Started

Install `direnv` module.

We use [direnv](https://direnv.net/) to manage environment variables.  You'll likely need to install it.

```sh
cp .envrc.example .envrc
```

To run fork scripts, deploy or perform any operation with a mainnet node you will need Alchemy accounts

# Setup
```.sh
yarn
```

# Development

Simulate the Fork on Mainnet

```
yarn fork:mainnet
```

```
yarn upgrade:mainnet:test
```

```
yarn simulate:mainnet
```

## Deploy Contracts

`yarn deploy:[NETWORK]`

```bash
yarn deploy:mainnet
```

```bash
yarn deploy:polygon
```

```bash
yarn deploy:avalanche
```

## Upgrade Contracts

`yarn upgrade:[NETWORK]`

```bash
yarn upgrade:mainnet
```

```bash
yarn upgrade:polygon
```

```bash
yarn upgrade:avalanche
```

When running a fork of blockchain the `test` command can be added at the end of the target `action`.

```bash
yarn upgrade:mainnet:test

yarn upgrade:polygon:test

yarn upgrade:avalanche:test
```

## Test Deployment Scripts Contracts

`yarn node:[NETWORK]`

```bash
yarn node:mainnet
```

```bash
yarn node:polygon
```

```bash
yarn node:avalanche
```

## Forking Networks
To run the deployment scripts against a staging environment all the target chains can be forked at a target block number.

The `.envrc` file holds RPC url, fork blocknumber and enabled status for all networks.

Environment Variable Examples
```bash
# Polygon Support
export POLYGON_ENABLED=1
export POLYGON_CHAIN_ID=137
export POLYGON_RPC_URL=""
export POLYGON_FORK_BLOCK_NUMBER=1
export POLYGON_RPC_URL=""
export POLYGONSCAN_API_KEY=""
```
`yarn fork:[NETWORK]`

```bash
yarn fork:mainnet
```

```bash
yarn fork:polygon
```

```bash
yarn fork:avalanche
```