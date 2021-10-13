const blessed = require("blessed");
const contrib = require("blessed-contrib");

function ContractTree(screen) {

  const container = blessed.box({
    hidden: true,
    top: 'center',
    left: 'center',
    width: '50%',
    height: '50%',
    padding: 2,
    draggable: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      border: {
        fg: '#f0f0f0'
      },
    }
  })

  container.on('focused', () => {
    console.log('CLICKED')
    toggle()
  })

  screen.append(container)

  const button = blessed.box({
    clickable: true,
    content: 'Close',
    top: '-2%',
    left: '85%',
    // position: {
      // right: '0%'
    // },
    height: 'shrink',
    width: '10%',
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      border: {
        fg: '#f0f0f0'
      },
    }
  })

  button.on('click', (event) => {
    console.log('CLICKED')
    console.log(event, 'eventevent')
    toggle()
  })
  
  function toggle() {
    container.toggle()
  }
  
  const content = blessed.box({
    top: '0%',
    width: '99%',
    height: 'shrink',
    content: `
Documentation:
----------------------------------------------------
    `,
  });

  // container.append(content)
  // container.append(button)


  // top: 1,
  // width: 0,
  // left: 1,
  // style: options.style,
  // padding: options.padding,
  // keys: true,
  // tags: options.tags,
  // input: options.input,
  // vi: options.vi,
  // ignoreKeys: options.ignoreKeys,
  // scrollable: options.scrollable,
  // mouse: options.mouse,
  // selectedBg: options.selectedBg || 'blue',
  // selectedFg: options.selectedFg || 'black',
  const tree = contrib.tree({
    fg: 'green',
    selectedFg: 'white',
    selectedBg: 'blue'
  })

   //allow control the table with the keyboard
   tree.focus()

   tree.on('select',function(node){
     console.log('selecng')
    if(container.hidden) {
      toggle()
      container.append(content)
      // container.append(button)
    } else {
      toggle()
    }
  })
  
   // you can specify a name property at root level to display root
   tree.setData({ 
     extended: true, 
     children: {
       'DrawBeacon': { 
          extended: true,
          children: { 
            'startDraw': {},
            'completeDraw': {}
        }
       },
       'Calculator': { 
        extended: true,
        children: { 
          'calculate': {},
      }
     },
       'PrizeDistributor': { 
          extended: true,
          children: { 
            'claim': {},
        }
       },
       'DrawBuffer': { 
        extended: true,
        children: { 
          'setDraw': {}
        },
        'DrawBuffer': { 
          children: { 
            'setDraw': {}
          }
        }
      }
    }
  })

  return tree
}

module.exports = {
  ContractTree
}