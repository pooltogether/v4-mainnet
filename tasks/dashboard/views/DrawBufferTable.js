const blessed = require("blessed");
const contrib = require('blessed-contrib');

function DrawBufferTable(parent) {
  const box = contrib.table({
    parent: parent
     , fg: 'white'
     , width: '97%'
     , height: '50%'
     , columnSpacing: 3 //in chars
     , headerSpacing: 3
     , columnWidth: [6, 12, 8, 9, 10, 14, 12, 12] /*in chars*/ 
  })

  return box
};

module.exports = {
  DrawBufferTable
}