import { HardhatRuntimeEnvironment } from "hardhat/types";

export function isBinance(hardhat: HardhatRuntimeEnvironment) {
  const network = hardhat.network.name
  return /bsc/.test(network);
}

export function isPolygon(hardhat: HardhatRuntimeEnvironment) {
  const network = hardhat.network.name
  return /polygon/.test(network) || /matic/.test(network) || /mumbai/.test(network)
}

export function isAvalancheFuji(hardhat: HardhatRuntimeEnvironment) {
  const network = hardhat.network.name
  return /avalanche/.test(network) || /fuji/.test(network) || /avalancheFuji/.test(network)
}