#!/usr/bin/env node

const {
    computeTiersFromAbsolutePrizes,
    computePrizeFromAbsolutePrizes
} = require('@pooltogether/v4-js')

const { utils, ethers } = require('ethers')
const { formatUnits, parseUnits } = utils

const prizeTiers = [
    parseUnits('2500', 6),
    parseUnits('500', 6),
    parseUnits('200', 6),
    parseUnits('50', 6),
    parseUnits('10', 6),
    parseUnits('5', 6),
    parseUnits('1', 6)
]

const tiers = computeTiersFromAbsolutePrizes(2, prizeTiers)

tiers.forEach((fraction, index) => {
    console.log(`Tier ${index}: ${fraction.toString()}`)
})

const prize = computePrizeFromAbsolutePrizes(2, prizeTiers)

console.log(`Total payout: ${prize.toString()} (${formatUnits(prize, 6)})`)

