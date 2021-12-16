import { cyan } from './colors'
import { displayResult } from './displayResult'
import hardhat from 'hardhat'

const { deployments } = hardhat
const { deploy } = deployments

export async function deployAndLog(name, options) {
  cyan(`\nDeploying ${name}...`)
  const result = await deploy(name, options)
  displayResult(name, result)
  return result
}
