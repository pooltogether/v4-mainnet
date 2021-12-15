import chalk from "chalk"
import hre from "hardhat"
import increaseTimeAndMineBlock from '../helpers/increaseTimeAndMineBlock'
async function actionIncreaseTimeAndStartCompleteDraw() {
    const drawBeacon = await hre.ethers.getContract('DrawBeacon')
    
    {
        console.log('DrawBeacon: Configuration BEFORE TimeIncrease')
        const beaconPeriodSeconds = await drawBeacon.getBeaconPeriodSeconds()
        const canStartDraw = await drawBeacon.canStartDraw()
        const canCompleteDraw = await drawBeacon.canCompleteDraw()

        console.log('DrawBeacon Beacon PeriodSeconds:', beaconPeriodSeconds.toString())
        console.log('Can Start Draw:', canStartDraw)
        console.log('Can Complete Draw:', canCompleteDraw)
        await increaseTimeAndMineBlock(beaconPeriodSeconds)
    }

    
    {
        const beaconPeriodSeconds = await drawBeacon.getBeaconPeriodSeconds()
        const canStartDraw = await drawBeacon.canStartDraw()
        const canCompleteDraw = await drawBeacon.canCompleteDraw()

        chalk.green(console.log('DrawBeacon: Configuration AFTER TimeIncrease'))
        console.log('DrawBeacon Beacon PeriodSeconds:', beaconPeriodSeconds.toString())
        console.log('Can Start Draw:', canStartDraw)
        console.log('Can Complete Draw:', canCompleteDraw)
        await drawBeacon.startDraw()
        // Increase Time by Beacon Period Seconds so we can Complete Draw
        await increaseTimeAndMineBlock(beaconPeriodSeconds)
    }
    
    {
        chalk.green(console.log('DrawBeacon: AFTER New Draw Started'))
        const canStartDraw = await drawBeacon.canStartDraw()
        const canCompleteDraw = await drawBeacon.canCompleteDraw()
        console.log('Can Start Draw:', canStartDraw)
        console.log('Can Complete Draw:', canCompleteDraw)
        drawBeacon.completeDraw()

    }
}

export default actionIncreaseTimeAndStartCompleteDraw