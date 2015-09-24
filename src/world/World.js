const DATA = require('../data/DATA');
const Room = require('./Room');
const Player = require('../entities/Player');
const Editor = require('../entities/Editor');
const Env = require('../Env');

const {Always, Random, Click, Collision} = require('../logic/sensors/');
const {And, Or, Count} = require('../logic/combiners/');

class World {

  constructor () {
    // === testing sensors ===
    this.sensors = [];
    this.combiners = [];

    const s1 = new Always(3);
    const s2 = new Always(100);
    const clicker = new Click(13);
    const rando = new Random(300);
    const trig = new Collision(['Trigger']);
    this.sensors.push(s1, s2, clicker, rando);

    const toggleLight = () => {
      Env.events.emit('action', {
        "name": "toggleLight",
        "to": 16
      });
    };
    const toggleItem = (id) => {
      Env.events.emit('action', {
        "name": "toggle",
        "to": "room",
        "item": id
      });
    };

    trig.add(() => this.loadRoom(DATA.bedroom2));

    const c1 = new And(s1, s2);
    const c2 = new Count(clicker, 5, true);
    const c3 = new Or(c1, c2);
    this.combiners.push(c1, c2, c3);

    //c3.add(() => toggleItem(20));

    // =========================

    this.player = new Player();
    this.editor = new Editor();
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
          "relativeTo": 20,
          "randomYo": true
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
    this.combiners.forEach(c => c.update());

    room.update(renderer, camera, controls);

    controls.keys.pressed.forEach(p => {
      if (p.which === 192 /*backtick*/) {
        room.setViewer(room.viewer === this.player ? this.editor : this.player);
      }
    });
  }

}

module.exports = World;
