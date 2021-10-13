const chalk = require('chalk');
const red = (msg) => chalk.red(`${msg}`)
const blue = (msg) => chalk.blue(`${msg}`)
const dim = (msg) => chalk.dim(`${msg}`)
const cyan = (msg) => chalk.cyan(`${msg}`)
const green = (msg) => chalk.green(`${msg}`)
const blueBright = (msg) => chalk.blueBright(`${msg}`)
const bgBlue = (msg) => chalk.bgBlue(`${msg}`)

module.exports = {
  red, blue, dim, cyan, blueBright, green, bgBlue
}