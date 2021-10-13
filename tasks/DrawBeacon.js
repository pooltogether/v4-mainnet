const contracts = require('../testnet.json');
const { drawBeaconHandleDrawStartAndComplete } = require('@pooltogether/v4-autotask-lib');
const { getUserAndWallet } = require('./utils/getUserAndWallet');
const debug = require('debug')('tasks')

