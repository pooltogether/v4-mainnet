const { yellow, green } = require('./colors')

function displayResult(name, result) {
    if (!result.newlyDeployed) {
        yellow(`Re-used existing ${name} at ${result.address}`);
    } else {
        green(`${name} deployed at ${result.address}`);
    }
}

module.exports = {
    displayResult
}