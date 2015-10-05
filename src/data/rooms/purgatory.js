module.exports = {
  'name': 'purgatory',
  'items': [
  {
    "id": 1,
    "type": "Computer",
    "name": "",
    "args": {
      "program": "1 # the light\n20 poke 0, 3\n30 cls()\n25 poke 1, 0\n30 print\"come to the light\", 12, 9\n31 poke 1, 1\n36 print\"come to the light\", 12, 11\n37 poke 1, 2\n38 print\"come to the light\", 12, 13"
    },
    "events": [
      "keydown",
      "keyup"
    ],
    "pos": [
      4.0733,
      0.2,
      -7.7316
    ],
    "rot": [
      0,
      0.15,
      0
    ]
  },
  {
    "id": 2,
    "type": "Box",
    "name": "",
    "args": {
      "color": 7829369
    },
    "pos": [
      3.9762,
      -0.9225,
      -3.4936
    ],
    "ons": {
      "itemSelected": [
        {
          "name": "toggleLight",
          "to": 4
        }
      ]
    },
    "scale": [
      3.4099,
      1,
      0.1475
    ],
    "rot": [
      0,
      0,
      0
    ]
  },
  {
    "id": 3,
    "type": "Box",
    "name": "",
    "args": {
      "color": 7829369
    },
    "pos": [
      4.7912,
      -0.9,
      -8.0472
    ],
    "rot": [
      0,
      0.785,
      0
    ]
  },
  {
    "id": 3,
    "type": "Trigger",
    "name": "",
    "args": {
      "onTrigger": {
        "type": "changeRoom",
        "room": "hall",
        "transform": {
          "pos": [
            0,
            0,
            0
          ],
          "rot": [
            0,
            0,
            0
          ]
        }
      }
    },
    "pos": [
      4.1274,
      0.4499,
      -7.3501
    ],
    "rot": [
      0,
      0,
      0
    ]
  },
  {
    "id": 4,
    "type": "Light",
    "name": "",
    "args": {},
    "pos": [
      4.3999,
      2.5499,
      -3.6226
    ],
    "rot": [
      0,
      0,
      0
    ]
  },
  {
    "id": 5,
    "type": "Box",
    "name": "",
    "args": {
      "color": 9514002
    },
    "pos": [
      5.2007,
      -1.425,
      -5.3084
    ],
    "scale": [
      20.6549,
      0.1949,
      16.7
    ],
    "rot": [
      0,
      0.7853,
      0
    ]
  },
  {
    "id": 43,
    "type": "Box",
    "name": "",
    "args": {
      "color": 5461318,
      "roof": false
    },
    "pos": [
      8.4685,
      -1.3125,
      -2.036
    ],
    "scale": [
      5.5899,
      0.01,
      6.3074
    ],
    "rot": [
      0,
      0,
      0
    ]
  },
  {
    "id": 44,
    "type": "Box",
    "name": "",
    "args": {
      "color": 5461318,
      "roof": false
    },
    "pos": [
      4.6685,
      -1.315,
      -6.466
    ],
    "scale": [
      5.4399,
      0.01,
      5.8073
    ],
    "rot": [
      0,
      0,
      0
    ]
  },
  {
    "id": 57,
    "type": "Box",
    "name": "",
    "args": {
      "color": 7829369
    },
    "pos": [
      3.0442,
      -0.9,
      -7.4653
    ],
    "ons": {
      "itemSelected": [
        {
          "name": "toggleLight",
          "to": 4
        }
      ]
    },
    "scale": [
      1,
      1,
      1.4
    ],
    "rot": [
      0,
      0.7853,
      0
    ]
  },
  {
    "id": 58,
    "type": "Box",
    "name": "",
    "args": {
      "color": 7829369
    },
    "pos": [
      5.5762,
      -0.9225,
      -1.2161
    ],
    "ons": {
      "itemSelected": [
        {
          "name": "toggleLight",
          "to": 4
        }
      ]
    },
    "scale": [
      0.21,
      1,
      4.5949
    ],
    "rot": [
      0,
      0,
      0
    ]
  }
]
};
