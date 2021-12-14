import { HardhatRuntimeEnvironment } from "hardhat/types";
import { isBinance, isAvalancheFuji, isPolygon } from './isNetwork'

export function getHardhatConfigFile(hardhat: HardhatRuntimeEnvironment) {
  let config
  if (isBinance(hardhat)) {
    config = 'hardhat.config.bsc.js'
  }
  else if (isPolygon(hardhat)) {
    config = 'hardhat.config.polygon.js'
  }
  else if (isAvalancheFuji(hardhat)) {
    config = 'hardhat.config.avalanche.ts'
  }
  else {
    config = ''
  }
  return config
}