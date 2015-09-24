const DATA = {

  'bedroom': {
    'name': 'bedroom',
    'items': [{
      "id": 1,
      "type": "Computer",
      "args": {},
      "events": [
        "keydown",
        "keyup"
      ],
      "pos": [
        1,
        0.1499, -1.3
      ],
      "rot": [
        0,
        0,
        0
      ]
    }, {
      "id": 2,
      "type": "Box",
      "args": {
        "color": 10066329
      },
      "pos": [-0.9347, -1,
        0.5404
      ],
      "rot": [
        0,
        0.7853,
        0
      ],
      "scale": [
        0.0299,
        1,
        0.9999
      ]
    }, {
      "id": 3,
      "type": "Box",
      "args": {
        "color": 10066329
      },
      "pos": [
        0.9999, -1, -1.4001
      ],
      "rot": [
        0,
        0.1409,
        0
      ],
      "scale": [
        0.755,
        1,
        0.01
      ]
    }, {
      "id": 4,
      "type": "Box",
      "args": {
        "color": 5587985
      },
      "pos": [
        2.1, -0.5001, -0.3002
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
      "id": 5,
      "type": "Box",
      "args": {
        "color": 10066329
      },
      "pos": [
        2.5337, -1.05,
        0.7941
      ],
      "rot": [
        0,
        0.785,
        0
      ],
      "scale": [
        0.0649,
        1,
        0.0299
      ]
    }, {
      "id": 6,
      "type": "Box",
      "args": {
        "color": 5587985
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
      "id": 7,
      "type": "Box",
      "args": {
        "color": 8418677
      },
      "pos": [
        1.1999, -1.5001, -0.1001
      ],
      "rot": [
        0,
        0.777,
        0
      ],
      "scale": [
        4.25,
        0.01,
        4.0999
      ]
    }, {
      "id": 8,
      "type": "Box",
      "args": {
        "color": 10066329
      },
      "pos": [
        3.1998, -0.9601,
        0.1397
      ],
      "rot": [
        0,
        0.785,
        0
      ],
      "scale": [
        0.0649,
        1,
        0.0299
      ]
    }, {
      "id": 9,
      "type": "Box",
      "args": {
        "color": 2245666
      },
      "pos": [
        2.2082, -0.435, -0.2817
      ],
      "rot": [
        0,
        0.942,
        0
      ],
      "scale": [
        0.9,
        0.025,
        0.5499
      ]
    }, {
      "id": 10,
      "type": "Box",
      "args": {
        "color": 2245666
      },
      "pos": [
        2.6259, -0.4351,
        0.2621
      ],
      "rot": [
        0,
        0.6435,
        0
      ],
      "scale": [
        0.9,
        0.025,
        0.5499
      ]
    }, {
      "id": 11,
      "type": "Box",
      "args": {
        "color": 3355460
      },
      "pos": [-0.1829, -0.38,
        0.0171
      ],
      "rot": [
        0,
        0.7853,
        0
      ],
      "scale": [
        0.7,
        0.1399,
        0.5498
      ]
    }, {
      "id": 12,
      "type": "Box",
      "args": {
        "color": 2236962
      },
      "pos": [
        0.1039, -0.43, -0.4462
      ],
      "rot": [
        0,
        0.7853,
        0
      ],
      "scale": [
        0.7,
        0.0399,
        0.01
      ]
    }, {
      "id": 13,
      "type": "Box",
      "args": {
        "color": 3355460
      },
      "pos": [
        2.6831,
        0.6298, -1.558
      ],
      "rot": [
        0,
        0.7769,
        1.5865
      ],
      "scale": [
        4.25,
        0.01,
        4.0999
      ]
    }, {
      "id": 14,
      "type": "Box",
      "args": {
        "color": 3355460
      },
      "pos": [-0.4842, -0.3951,
        0.4484
      ],
      "rot": [
        0,
        0.7853,
        0
      ],
      "scale": [
        0.1975,
        0.1148,
        0.3373
      ]
    }, {
      "id": 15,
      "type": "Switch",
      "args": {
        "color": 10066329
      },
      "pos": [
        3.6597,
        0.4291, -0.4768
      ],
      "rot": [
        0,
        0.7457,
        1.555
      ],
      "ons": {
        "itemSelected": [{
          "name": "toggleLight",
          "to": 16
        }]
      },
      "scale": [
        0.32,
        0.0974,
        0.2025
      ]
    }, {
      "id": 16,
      "type": "Light",
      "args": {},
      "pos": [
        1,
        2.5,
        3
      ],
      "rot": [
        0,
        0,
        0
      ]
    },
    {
      "id": 17,
      "type": "Trigger",
      "pos": [
        -1.5,
        1,
        -0.9
      ],
      "rot": [
        0,
        0.8011,
        0.0785
      ],
    }]
  },

  'bedroom2': {
    'name': 'bedroom2',
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
      scale: [1, 1, 1.4],
      "ons": {
        "itemSelected": [{
          "name": "toggleLight",
          "to": 4
        }]
      },
    }, {
      "type": "Box",
      args: {
        color: 0x777779
      },
      "rot": [0, 0.785, 0],
      "pos": [1.9, -0.9, -1.2]
    },
    {
      "id": 3,
      "type": "Trigger",
      "pos": [
        1.5,
        1,
        -2.9
      ],
    },
    {
      "id": 4,
      "type": "Light",
      "args": {},
      "pos": [
        0,
        1,
        1.7
      ],
    }]
  },

  'hall': {
    'name': 'hall',
    'items': [{
      type: 'Box',
      pos: [0, 2, -5]
    }]
  }

};

window.DATA = DATA;

module.exports = DATA;
