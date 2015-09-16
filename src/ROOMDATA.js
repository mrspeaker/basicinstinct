const ROOMDATA = {

  'bedroom': {
    'items': [{
      type: 'Computer',
      args: [],
      pos: [0, 0.2, -1],
      rot: [0, Math.PI / 8, 0],
      events: ['keydown', 'keyup']
    }, {
      type: 'Box',
      args: [0x554400], // args should be an object {col:0x555,etc...}
      pos: [0, -0.9, -1],
      rot: [0, Math.PI / 4, 0],
      scale: [4, 1, 1.4]
    }],
    'lights': []
  },

  'hall': {
    'items': [{
      type: 'Box',
      pos: [0, 2, -5]
    }]
  }

};

window.ROOMDATA = ROOMDATA;

module.exports = ROOMDATA;
