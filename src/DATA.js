const DATA = {

  'bedroom': {
    'items': [{
      type: 'Computer',
      args: {},
      pos:  [1, 0.2, -1.3],
      rot: [ 0, 0.15, 0 ],
      events: ['keydown', 'keyup']
    }, {
      type: 'Box',
      args: {color: 0x777779},
      pos: [0.2, -0.9, -1.4],
      rot: [0, Math.PI / 4, 0],
      scale: [1, 1, 1.4]
    },
    {
      "type": "Box",
      args: {color: 0x777779},
      "rot": [0, 0.785, 0 ],
      "pos": [ 1.9, -0.9, -1.2]
    }
  ],
    'lights': []
  },

  'hall': {
    'items': [{
      type: 'Box',
      pos: [0, 2, -5]
    }]
  }

};

window.DATA = DATA;

module.exports = DATA;
