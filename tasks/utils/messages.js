const { red, green, cyan } = require('./colors');

function convertErrorToMsg(EthersErrorInterface, contract) {
  if(EthersErrorInterface.error) {
    console.log(red('-------------------------------------------------------------------------'))
    console.log(green(`To: ${contract.address}`))
    console.log(cyan(`From: ${contract.signer.address}\n`))
    console.log(red(EthersErrorInterface.error))
    console.log(red('-------------------------------------------------------------------------'))
  }
}

module.exports = {
  convertErrorToMsg
}