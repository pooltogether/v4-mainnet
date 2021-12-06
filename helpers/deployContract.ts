import { Signer } from "@ethersproject/abstract-signer"

const { cyan, displayResult } = require('./colors')

export async function deployContract(deploy: Function, contract: string, deployer: string, args: any[]) {
  cyan(`\nDeploying ${contract}...`)
  const result = await deploy(contract, {
    from: deployer,
    args: args,
    skipIfAlreadyDeployed: true,
  })
  displayResult(`${contract}`, result)

  return result
}

export default deployContract;