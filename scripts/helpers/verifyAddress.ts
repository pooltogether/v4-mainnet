import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { getHardhatConfigFile } from './getHardhatConfigFile'

export const verifyAddress = async (hardhat: HardhatRuntimeEnvironment, address: string, args: Array<any>) => {
  const network = hardhat.network.name
  const config = getHardhatConfigFile(hardhat)
  console.log("Arguments: ", args)
  try {
    const result = await hardhat.run("verify:verify", {
      address: address,
      constructorArguments: args || [],
      config: config,
      network: network,
    });
    console.log("Verify Result: ", result)
  } catch (error) {
    console.log("Error: ", error)
  }
}
