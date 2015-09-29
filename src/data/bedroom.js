module.exports = {
  'name': 'bedroom',
  'items': [{
    "id": 1,
    "type": "Computer",
    "name": "",
    "args": {

    },
    "events": [
      "keydown",
      "keyup"
    ],
    "pos": [-0.5724,
      0.1499, -1.1666
    ],
    "rot": [
      0,
      0.7225,
      0
    ]
  }, {
    "id": 2,
    "type": "Box",
    "name": "",
    "args": {
      "color": 10066329
    },
    "pos": [-0.6698, -1,
      1.2228
    ],
    "scale": [
      1,
      1,
      0.03
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 3,
    "type": "Box",
    "name": "",
    "args": {
      "color": 10066329
    },
    "pos": [
      1.9848, -1, -1.2604
    ],
    "scale": [
      0.03,
      1,
      1
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 4,
    "type": "Box",
    "name": "",
    "args": {
      "color": 5587985
    },
    "pos": [
      0.7977, -0.5001, -1.2615
    ],
    "scale": [
      2.4,
      0.1,
      1
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 5,
    "type": "Box",
    "name": "",
    "args": {
      "color": 10066329
    },
    "pos": [-0.4813, -1.05, -0.9734],
    "scale": [
      0.0649,
      1,
      0.0299
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 6,
    "type": "Box",
    "name": "",
    "args": {
      "color": 5587985
    },
    "pos": [-0.6677, -0.5,
      0.0374
    ],
    "scale": [
      1,
      0.1,
      2.4
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 7,
    "type": "Box",
    "name": "",
    "args": {
      "color": 8418678
    },
    "pos": [
      0.4473, -1.5326, -0.4251
    ],
    "scale": [
      4.25,
      0.0875,
      4.0999
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 8,
    "type": "Box",
    "name": "",
    "args": {
      "color": 10066329
    },
    "pos": [-0.8502, -1.0401, -0.5104],
    "scale": [
      0.0649,
      1,
      0.0299
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 9,
    "type": "Box",
    "name": "",
    "args": {
      "color": 2245666
    },
    "ons": {
      "itemSelected": [{
        "name": "showListing",
        "to": "room",
        "text": `*** Achievement #1 ***

Enter the following program:

--------------
10 PRINT "HEY"
20 GOTO 10
RUN
--------------

Then hit 'escape' to complete.

`
      }]
    },
    "pos": [
      0.9062, -0.435, -1.309
    ],
    "scale": [
      0.4175,
      0.025,
      0.6848
    ],
    "rot": [
      0,
      0.2,
      0
    ]
  }, {
    "id": 10,
    "type": "Box",
    "name": "",
    "args": {
      "color": 2245666
    },
    "ons": {
      "itemSelected": [{
        "name": "showListing",
        "to": "room",
        "text": `*** Achievement #2 ***

It's a secret.

`
      }]
    },
    "pos": [
      1.5048, -0.4351, -1.1661
    ],
    "scale": [
      0.4125,
      0.025,
      0.7873
    ],
    "rot": [
      0,
      0.1,
      0
    ]
  }, {
    "id": 11,
    "type": "Box",
    "name": "",
    "args": {
      "color": 2236962
    },
    "pos": [-0.6581, -0.38,
      0.4921
    ],
    "scale": [
      0.4825,
      0.1399,
      0.7947
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 12,
    "type": "Box",
    "name": "",
    "args": {
      "color": 2236962
    },
    "pos": [-0.6987, -0.43, -0.2463],
    "scale": [
      0.7,
      0.0399,
      0.01
    ],
    "rot": [
      0,
      1.4,
      0
    ]
  }, {
    "id": 13,
    "type": "Box",
    "name": "",
    "args": {
      "color": 3355460
    },
    "pos": [
      0.6502,
      0.2003, -2.3351
    ],
    "scale": [
      4.4,
      3.3899,
      0.3
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 14,
    "type": "Box",
    "name": "",
    "args": {
      "color": 3355460
    },
    "pos": [-0.5719, -0.3951,
      1.0558
    ],
    "scale": [
      0.2775,
      0.1148,
      0.1947
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 15,
    "type": "Switch",
    "name": "",
    "args": {
      "color": 10066329
    },
    "pos": [
      2.5335, -0.2448, -2.1473
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
    ],
    "rot": [
      0,
      1.57,
      1.57
    ]
  }, {
    "id": 16,
    "type": "Light",
    "name": "",
    "args": {},
    "pos": [
      2.827,
      1.692,
      2.5198
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 17,
    "type": "Trigger",
    "name": "",
    "args": {
      "onTrigger": {
        type: "changeRoom",
        room: "purgatory",
        transform: {
          pos: [7.388, 0.35, 4.383],
          rot: [-0.077, 0.278, 0]
        }
      }
    },
    "pos": [
      3.8022, -0.3402, -2.2751
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 7,
    "type": "Box",
    "name": "",
    "args": {
      "color": 8418677
    },
    "pos": [
      0.4748, -1.5301,
      3.473
    ],
    "scale": [
      4.25,
      0.0875,
      4.0999
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 7,
    "type": "Box",
    "name": "",
    "args": {
      "color": 8418677
    },
    "pos": [
      4.694, -1.5326, -0.4961
    ],
    "scale": [
      4.25,
      0.0875,
      4.0999
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 7,
    "type": "Box",
    "name": "",
    "args": {
      "color": 8418677
    },
    "pos": [
      4.6845, -1.5301,
      3.4738
    ],
    "scale": [
      4.25,
      0.0875,
      4.0999
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 13,
    "type": "Box",
    "name": "",
    "args": {
      "color": 3355460
    },
    "pos": [-1.615,
      0.2178,
      2.0555
    ],
    "scale": [
      0.3149,
      3.3899,
      8.5023
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 13,
    "type": "Box",
    "name": "",
    "args": {
      "color": 3355460
    },
    "pos": [
      5.8099,
      0.2077, -2.3552
    ],
    "scale": [
      1.9,
      3.3899,
      0.3
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 13,
    "type": "Box",
    "name": "",
    "args": {
      "color": 3355460
    },
    "pos": [
      3.8527,
      1.3776, -2.3351
    ],
    "scale": [
      2.0349,
      1.0374,
      0.3
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 11,
    "type": "Box",
    "name": "",
    "args": {
      "color": 2236962
    },
    "pos": [
      0.6419, -1.2051,
      4.3045
    ],
    "scale": [
      4.0824,
      0.5397,
      2.5099
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 2,
    "type": "Box",
    "name": "",
    "args": {
      "color": 10066329
    },
    "pos": [-1.1649, -0.8325,
      3.6777
    ],
    "scale": [
      0.6375,
      0.2174,
      1.1049
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 2,
    "type": "Box",
    "name": "",
    "args": {
      "color": 10066329
    },
    "pos": [-1.1424, -0.83,
      4.8876
    ],
    "scale": [
      0.6375,
      0.2174,
      1.1049
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 10,
    "type": "Box",
    "name": "",
    "args": {
      "color": 2241314
    },
    "pos": [-1.4609,
      0.5573,
      4.2945
    ],
    "scale": [
      0.01,
      1.99,
      1.4373
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 7,
    "type": "Box",
    "name": "",
    "args": {
      "color": 6710886
    },
    "pos": [
      3.5016, -1.5476, -4.5087
    ],
    "scale": [
      6.4999,
      0.0875,
      4.0999
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 13,
    "type": "Box",
    "name": "",
    "args": {
      "color": 3355460
    },
    "pos": [
      6.6349,
      0.2077,
      2.0555
    ],
    "scale": [
      0.3149,
      3.3899,
      8.5023
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 13,
    "type": "Box",
    "name": "",
    "args": {
      "color": 3355460
    },
    "pos": [
      2.5426,
      0.2152,
      5.6197
    ],
    "scale": [
      8.4999,
      3.3899,
      0.3
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 7,
    "type": "Box",
    "name": "",
    "args": {
      "color": 4931381
    },
    "pos": [
      2.6345, -1.4901,
      1.8238
    ],
    "scale": [
      3.9849,
      0.01,
      3.2999
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 13,
    "type": "Box",
    "name": "",
    "args": {
      "color": 2236979
    },
    "pos": [
      4.4525,
      0.2201, -6.3853
    ],
    "scale": [
      8.4999,
      3.3899,
      0.3
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 7,
    "type": "Box",
    "name": "",
    "args": {
      "color": 10066329,
      "roof": true
    },
    "pos": [
      2.4823,
      1.8673,
      1.5749
    ],
    "scale": [
      7.9999,
      0.0875,
      8.1998
    ],
    "rot": [
      0,
      0,
      0
    ]
  }, {
    "id": 100,
    "type": "Computer",
    "name": "hallComputer",
    "args": {
      program: `1 # its a trap
20 poke 0, 11
30 cls()
25 poke 1, 3
30 print"it's a trap", 15, 9
31 poke 1, 0
35 print"it's a trap", 15, 11
38 poke 1, 5
40 print"it's a trap", 15, 13
`
    },
    "events": [
      "keydown",
      "keyup"
    ],
    "pos": [
      3.4787,
      0.3499, -6.4752
    ],
    "scale": [
      1.575,
      1.35,
      1.56
    ],
    "rot": [
      0,
      0,
      0
    ]
  }]
};
