import chalk from 'chalk'
import hre from 'hardhat'

export async function distributeEthToAccounts() {
  console.log(chalk.dim(`Distributing ETH to Core Accounts`))
  const { deployer, executiveTeam, ptOperations } = await hre.getNamedAccounts()
  const deployerSigner = hre.ethers.provider.getSigner(deployer)
  const recipients = {
      ['Deployer']: deployer,
      ['PoolTogether Operations']: ptOperations,
      ['PoolTogether Executive']: executiveTeam
  }
  const keys = Object.keys(recipients)
  for (var i = 0; i < keys.length; i++) {
    const name = keys[i]
    const address = recipients[name]
    console.log(chalk.dim(`Sending 100 Ether to ${name}...`))
    await deployerSigner.sendTransaction({ to: address, value: hre.ethers.utils.parseEther('100') })
  }

  console.log(chalk.green(`ETH Distributed`))
}

export default distributeEthToAccounts