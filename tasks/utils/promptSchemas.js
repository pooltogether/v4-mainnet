const colors = require('colors/safe')
function exportDrawPromptSchema() {
  let prompt_schema = [{
    name: 'drawId',
    description: colors.magenta("DrawId"),
    required: true
  }, {
    name: 'timestamp',
    description: colors.magenta("Timestamp"),
    required: true
  },
  {
    name: 'winningRandomNumber',
    description: colors.magenta("WinningRandomNumber"),
    required: true
  }]

  return prompt_schema
}

module.exports = {
  exportDrawPromptSchema
}