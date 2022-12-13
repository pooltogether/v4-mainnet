const chalk = require('chalk');

export function dim(...args) {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.dim.call(chalk, ...args));
  }
}

export function cyan(...args) {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.cyan.call(chalk, ...args));
  }
}

export function yellow(...args) {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.yellow.call(chalk, ...args));
  }
}

export function red(...args) {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.red.call(chalk, ...args));
  }
}

export function green(...args) {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.green.call(chalk, ...args));
  }
}

export default {
  dim,
  cyan,
  red,
  yellow,
  green,
};
