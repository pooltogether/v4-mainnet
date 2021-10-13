
const blessed = require('blessed');

function getDashboardAreas() {
    // Left Top : Area
    const areaTopLeft = blessed.box({
      top: '0',
      left: '0',
      width: '50%',
      height: '70%',
      label: 'Admin Dashboard --- ',
      padding: 1,
      border: {
        type: 'line'
      },
    });
    
  
    // Left Top : Area
    const areaTopCenterRowFirst = blessed.box({
      top: '0',
      left: '75%',
      width: '25%',
      height: '15%',
      label: ' Ticket --- ',
      padding: 1,
      border: {
        type: 'line'
      },
    });
  
    const areaTopCenterRowSecond = blessed.box({
      top: '15%',
      left: '75%',
      width: '25%',
      height: '85%',
      label: ' DrawBeacon --- ',
      padding: 1,
      border: {
        type: 'line'
      },
    });
  
    const areaTopRight = blessed.box({
      top: '0',
      left: '50%',
      width: '25%',
      height: '70%',
      label: ' Overview --- ',
      padding: 1,
      tags: true,
      border: {
        type: 'line'
      },
    });
    
    const areaBottomLeft = blessed.box({
      top: '70%',
      left: '0',
      width: '50%',
      height: '30%',
      content: '',
      tags: true,
      label:' Owner/Manager Overview ---',
      padding: 1,
      border: {
        type: 'line'
      },
      style: {
      }
    });
      
    const areaBottomRight = blessed.box({
      top: '70%',
      left: '50%',
      width: '25%',
      height: '30%',
      content: '',
      tags: true,
      border: {
        type: 'line'
      },
      style: {
    
      }
    });

    return {areaTopLeft, areaTopCenterRowFirst, areaTopCenterRowSecond, areaTopRight, areaBottomLeft, areaBottomRight }
}

module.exports = getDashboardAreas