const DATA = require('../data/DATA');
const Room = require('./Room');
const Player = require('../entities/Player');
const Editor = require('../entities/Editor');
const Env = require('../Env');


const {THREE} = require('three');

class World {

  constructor () {
    this.rooms = {};
    this.player = new Player();
    this.editor = new Editor();
    this.player.mesh.position.set(1, 0, 4);
    this.editor.mesh.position.set(1, -0.5, 5);
    this.hasFocus = true;

    this.createWorldBus();
    this.loadRoom(DATA.bedroom);

    {
      // Arror for ray caster
      const dir = new THREE.Vector3(0, 1, 0);
      const origin = new THREE.Vector3(0, 0, 0);
      this.arrowHelper = new THREE.ArrowHelper(dir, origin, 5, 0xffff00, 0.1, 0.1);
      //this.room.scene.add(this.arrowHelper);
    }

    Env.events.emit('WorldCreated');
    this.toggleEditor(); // Go to editor mode first.

  }

  addTestItem() {
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
        /*"WorldCreated": [{
          "name": "toggleLight",
          "to": 16,
        }]*/
      },
      "pos": [0.5, 1, 0],
      "scale": [0.3, 0.3, 0.3]
    });
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
            if (attr === "toggle") {
              console.log(item, item.type === "Light")
              if (item.type === "Light") {
                Env.events.emit('action', {
                  "name": "toggleLight",
                  "to": item.id
                });
              }
            } else {
              const type = {p:'position', r:'rotation', s:'scale'}[attr[0]];
              const axis = attr[attr.length - 1];
              item.mesh[type][axis] = value;
            }
          }
          break;
        case 'programEnded':
          //console.log('Computer stopped!');
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
    if (this.rooms[data.name]) {
      // Already laoded!
      this.room = this.rooms[data.name];
    } else {
      this.room = new Room(data, this.player, (name, triggerLoc) => {
        this.room.scene.remove(this.player.mesh);
        this.room.scene.remove(this.editor.mesh);
        this.room.onLeave();
        this.loadRoom(triggerLoc ? DATA[triggerLoc] : name === 'bedroom' ? DATA.bedroom2 : DATA.bedroom);
      });
      this.rooms[data.name] = this.room;
    }

    this.player.doSyncCam = true;

    this.room.addEntity(this.player);
    this.room.addEntity(this.editor);
    this.room.onEnter();
  }

  toggleEditor () {
    const {room, player, editor} = this;
    const current = room.viewer;
    const newGuy = current === player ? editor : player;
    const isEditor = newGuy === editor; // will be toggled at the end!
    room.items.forEach(i => {
      if (i.invisible) {
        i.mesh.visible = isEditor;
      }
    });
    room.entities.forEach(i => {
      if (i.invisible) {
        i.mesh.visible = isEditor;
      }
    });
    room.setViewer(newGuy);
    editor.toggleUI(isEditor);
  }

  update (renderer, camera, controls) {
    const {room} = this;

    room.update(renderer, camera, this.hasFocus ? controls : null);
    if (this.hasFocus) {
      controls.keys.pressed.forEach(p => {
        if (p.which === 192 /*backtick*/) {
          this.toggleEditor();
        }
      });
    }

    {
      // Arrow helper
      const feetPos = this.editor.mesh.position.clone();
      feetPos.y -= 0.5;
      const a = this.arrowHelper;
      //a.setOrigin(feetPos);
      //const arrowPos = feetPos.clone().add(feetPos.multiplyScalar(-0.5));
      //arrowPos.translateZ(a.length / 2);
      //a.position.copy(arrowPos);
      //a.position.copy(feetPos);
      a.setDirection(new THREE.Vector3(0, 1, 0));
    }
  }

}

module.exports = World;
