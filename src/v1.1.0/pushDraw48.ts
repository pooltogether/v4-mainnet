import hardhat from 'hardhat'
import { green, yellow } from '../colors'
import {
    END_TIMESTAMP_OFFSET,
    EXPIRY_DURATION
} from '../constants'

const { ethers } = hardhat

export async function pushDraw48() {
    yellow(`\nPushing Prize Tier configuration for Draw 48 onto the Prize Tier History...`)
    const prizeTierHistory = await ethers.getContract('PrizeTierHistory')
    const pushTx = await prizeTierHistory.push({
        drawId: 48,
        bitRangeSize: 2,
        maxPicksPerUser: 2,
        endTimestampOffset: END_TIMESTAMP_OFFSET,
        prize: '17632000000',
        tiers: ['141787658', '85072595', '136116152', '136116152', '108892921', '217785843', '174228675', 0, 0, 0, 0, 0, 0, 0, 0, 0],
        expiryDuration: EXPIRY_DURATION
    })
    await pushTx.wait(1)
    green(`Done!`)
}