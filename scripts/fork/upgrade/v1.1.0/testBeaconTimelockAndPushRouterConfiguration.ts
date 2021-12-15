import hre from "hardhat"
import increaseTimeAndMineBlock from '../../helpers/increaseTimeAndMineBlock'

async function testBeaconTimelockAndPushRouterConfiguration() {
    const drawBeacon = await hre.ethers.getContract('DrawBeacon')

}

export default testBeaconTimelockAndPushRouterConfiguration