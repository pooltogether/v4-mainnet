// @ts-nocheck
const chalk = require('chalk');

export function dim() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.dim.call(chalk, ...arguments));
  }
}

export function cyan() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.cyan.call(chalk, ...arguments));
  }
}

export function yellow() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.yellow.call(chalk, ...arguments));
  }
}

export function green() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.green.call(chalk, ...arguments));
  }
}

export function displayResult(name, result) {
  if (!result.newlyDeployed) {
    yellow(`Re-used existing ${name} at ${result.address}`);
  } else {
    green(`${name} deployed at ${result.address}`);
  }
}

export default {
  dim, cyan, yellow, green, displayResult
}