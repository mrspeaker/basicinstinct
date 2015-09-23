const DATA = require('../data/DATA');
const Room = require('./Room');
const Player = require('../entities/Player');
const Editor = require('../entities/Editor');
const Env = require('../Env');
const Always = require('../logic/sensors/Always');
const Random = require('../logic/sensors/Random');

class World {

  constructor () {
    this.player = new Player();
    this.editor = new Editor();


    this.sensors = [];
    const s1 = new Random();

    const act1 = () => {
      Env.events.emit('action', {
        "name": "toggleLight",
        "to": 16,
      });
    };

    s1.add(act1);
    this.sensors.push(s1);

    this.player.mesh.position.set(1, 0, 4);
    this.editor.mesh.position.set(1, -0.5, 6);

    this.createWorldBus();
    this.loadRoom(DATA.bedroom);

    this.room.addItem({
      "id": 20,
      "type": "Box",
      "args": {
        "color": 5066329
      },
      "ons": {
        "itemSelected": [{
          "name": "addItem",
          "to": "room",
          "defn": {
            "type": "Box",
            "pos": [0, 0, 2],
            "scale": [0.3, 0.3, 0.3],
            "ons": {
              "itemSelected": [{
                "name": "toggle",
                "to": 20
              }]
            }
          },
          "relativeTo": 20
        },
        /*{
          "name": "removeItem",
          "to": "room",
          "item": 20
        }*/
        ],
        "WorldCreated": [{
          "name": "toggleLight",
          "to": 16,
        }]
      },
      "pos": [0.5, 1, 0],
      "scale": [0.3, 0.3, 0.3]
    });

    Env.events.emit('WorldCreated');

  }

  createWorldBus () {
    this.bus = {
      // Hmmm... this should get pushed into the Actions system.
      fire: args => {
        switch (args.type) {
        case 'set':
          const {id, attr, value} = args;
          const item = this.room.items.find(i => i.id == id);
          if (item) {
            const type = {p:'position', r:'rotation', s:'scale'}[attr[0]];
            const axis = attr[attr.length - 1];
            item.mesh[type][axis] = value;
          }
          break;
        case 'programEnded':
          console.log('Computer stopped!');
          break;
        default:
          console.log('unhandled world bus msg:', args);
        }
      },

      get: (id, attr) => {
        const item = this.room.items.find(i => i.id == id);
        var retVal = 0;
        if (item) {
          const type = {p:'position', r:'rotation', s:'scale'}[attr[0]];
          const axis = attr[attr.length - 1];
          retVal = item.mesh[type][axis];
        }
        return retVal;
      }
    };
  }

  loadRoom (data) {
    if (this.room) {
      this.room.onLeave && this.room.onLeave();
    }
    this.room = new Room(data, this.player);
    this.player.doSyncCam = true;
    this.room.scene.add(this.player.mesh);
    this.room.scene.add(this.editor.mesh);
  }

  update (renderer, camera, controls) {
    const {room} = this;

    this.sensors.forEach(s => s.update());

    room.update(renderer, camera, controls);

    controls.keys.pressed.forEach(p => {
      if (p.which === 192 /*backtick*/) {
        room.setViewer(room.viewer === this.player ? this.editor : this.player);
      }
    });
  }

}

module.exports = World;
