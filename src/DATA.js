const DATA = {

  'bedroom': {
    'items': [{
      "type": "Computer",
      "args": {},
      "events": [
        "keydown",
        "keyup"
      ],
      "pos": [
        1,
        0.2, -1.3
      ],
      "rot": [
        0,
        0.15,
        0
      ]
    }, {
      "type": "Box",
      "args": {
        "color": 7829369
      },
      "pos": [-0.7, -1,
        0.2
      ],
      "rot": [
        0,
        0.7853,
        0
      ],
      "scale": [
        0.7,
        1,
        0.9999
      ]
    }, {
      "type": "Box",
      "args": {
        "color": 7829369
      },
      "pos": [
        0.9999, -0.9, -1.2
      ],
      "rot": [
        0,
        0.785,
        0
      ]
    }, {
      "type": "Box",
      "args": {
        "color": 7829369
      },
      "pos": [
        2.1, -0.5001, -0.3001
      ],
      "rot": [
        0,
        0.785,
        0
      ],
      "scale": [
        1,
        0.1,
        2.2
      ]
    }, {
      "type": "Box",
      "args": {
        "color": 7829369
      },
      "pos": [
        2.6, -1,
        0.1999
      ],
      "rot": [
        0,
        0.785,
        0
      ],
      "scale": [
        0.9,
        1,
        0.6
      ]
    }, {
      "type": "Box",
      "args": {
        "color": 7829369
      },
      "pos": [-0.1001, -0.5001, -0.3001],
      "rot": [
        0,
        0.785,
        0
      ],
      "scale": [
        2.4,
        0.1,
        1
      ]
    }, {
      "type": "Box",
      "args": {
        "color": 7829369
      },
      "pos": [
        1.1999, -1.4001, -0.1
      ],
      "rot": [
        0,
        0.785,
        0
      ],
      "scale": [
        4.8,
        0.01,
        3.8
      ]
    }]
  },

  'bedroom2': {
    'items': [{
      type: 'Computer',
      args: {},
      pos: [1, 0.2, -1.3],
      rot: [0, 0.15, 0],
      events: ['keydown', 'keyup']
    }, {
      type: 'Box',
      args: {
        color: 0x777779
      },
      pos: [0.2, -0.9, -1.4],
      rot: [0, Math.PI / 4, 0],
      scale: [1, 1, 1.4]
    }, {
      "type": "Box",
      args: {
        color: 0x777779
      },
      "rot": [0, 0.785, 0],
      "pos": [1.9, -0.9, -1.2]
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

window.DATA = DATA;

module.exports = DATA;
