const { cyan } = require('./colors')
const { displayResult } = require('./displayResult')
const hardhat = require('hardhat')
const { deployments } = hardhat
const { deploy } = deployments

async function deployAndLog(name, options) {
  cyan(`\nDeploying ${name}...`)
  const result = await deploy(name, options)
  displayResult(name, result)
  return result
}

module.exports = {
    deployAndLog
}