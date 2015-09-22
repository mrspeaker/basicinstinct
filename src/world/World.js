const DATA = require('../data/DATA');
const Room = require('./Room');
const Player = require('../entities/Player');
const Editor = require('../entities/Editor');

class World {

  constructor () {
    this.player = new Player();
    this.editor = new Editor();

    this.player.mesh.position.set(1, 0, 4);
    this.editor.mesh.position.set(1, -0.5, 6);

    this.createWorldBus();
    this.loadRoom(DATA.bedroom);
  }

  createWorldBus () {
    this.bus = {
      fire: args => {
        if (args.type === 'set') {
          const {id, attr, value} = args;
          const item = this.room.items.find(i => i.id == id);
          if (item) {
            const type = {p:'position', r:'rotation', s:'scale'}[attr[0]];
            const axis = attr[attr.length - 1];
            item.mesh[type][axis] = value;
          }
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
    room.update(renderer, camera, controls);
    controls.keys.pressed.forEach(p => {
      if (p.which === 192 /*backtick*/) {
        room.setViewer(room.viewer === this.player ? this.editor : this.player);
      }
    });
  }

}

module.exports = World;
