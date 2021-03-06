/* @flow */

const DATA = require('../data/rooms/');
const Room = require('./Room');
const Player = require('../entities/Player');
const Editor = require('../entities/Editor');
const Env = require('../Env');
const store = require('../data/store');
const tasks = require('../data/tasks');

const {THREE} = require('three');
const Controls = require('../controls/');

class World {

  rooms: Object;
  room: Room;
  player: Player;
  editor: Editor;
  hasFocus: boolean;

  constructor () {
    this.rooms = {};
    this.player = new Player();
    this.player.position.set(1, 1, 4);
    this.editor = new Editor();
    this.editor.position.set(1, 0.8, 4);
    this.hasFocus = true;

    this.createSerialBus();
    this.bindEvents();
    this.loadRoom('bedroom');
    Env.events.emit('WorldCreated');
  }

  bindEvents () {
    Env.events.on('WorldCreated', () => Env.events.emit('task-init', 'hw'));
    Env.events.on('computer', args => this.processComputerCommand(args));
    Env.events.on('task-init', name => tasks[name].start());
    Env.events.on('loadRoom', name => this.loadRoom(name));
    Env.events.on('saveRoom', () => this.saveRoom());
    Env.events.on('popup', msg => {
      const pop = document.querySelector("#popup");
      pop.querySelector(".content").innerHTML = msg;
      pop.style.display = "block";
    });
  }

  createSerialBus () {
    // todo - add computer id
    Env.serialBus = {
      emit: args => Env.events.emit("computer", args),
      // 'get' has to be synchronous!
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

  processComputerCommand (args:Object) {
    switch (args.type) {
    case 'set':
      const {id, attr, value} = args;
      const item = this.room.items.find(i => i.id == id);
      if (item) {
        if (attr === "toggle") {
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
      console.log('Computer stopped.');
      Env.events.emit('programEnded', args);
      break;
    default:
      console.log('unhandled world bus msg:', args);
    }
  }

  loadRoom (roomName: string, transform: Object | void) {
    const {player, editor, rooms} = this;

    if (rooms[roomName]) {
      // Already laoded!
      this.room = rooms[roomName];
    } else {
      const data = store.loadRoom(roomName) || DATA[roomName];
      this.room = new Room(data, this.player, (name, trigger) => {
        const {room} = this;
        room.scene.remove(player.mesh);
        room.scene.remove(editor.mesh);
        room.onLeave();
        this.loadRoom(trigger.room, trigger.transform);
      });
      this.rooms[roomName] = this.room;
    }

    if (transform) {
      const {position} = player;
      const {pos, rot} = transform;
      position.set(pos[0], pos[1], pos[2]);
      // LOL... global! fix this shit!
      window.game.camera.rotation.set(rot[0], rot[1], rot[2]);
    }

    player.setSelected(null);

    const {room} = this;
    room.addEntity(player);
    room.addEntity(editor);
    room.onEnter();

    Env.events.emit('changeRoom', roomName);
  }

  saveRoom () {
    const {room} = this;
    const {items} = room;

    const out = {
      name: room.name,
      version: room.version || 1,
      items: items.map(i => room.getDefn(i))
    };
    store.saveRoom(out);
  }

  toggleEditor () {
    const {room, player, editor} = this;
    const current = room.viewer;
    const newGuy = current === player ? editor : player;
    const isEditor = newGuy === editor;
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
    editor.toggleUI(isEditor);
    player.toggleUI(!isEditor);
    player.mesh.visible = isEditor;
    editor.mesh.visible = false;
    room.setViewer(newGuy);
  }

  update (renderer:THREE.WebGLRenderer, camera:THREE.PerspectiveCamera, controls:Controls) {
    const {room, hasFocus} = this;

    room.update(renderer, camera, hasFocus ? controls : undefined);
    if (hasFocus) {
      controls.keys.pressed.forEach(p => {
        if (p.which === 192 /*backtick*/) {
          this.toggleEditor();
        }
      });
    }
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

}

module.exports = World;
