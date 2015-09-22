const {THREE} = require('three');
const Env = require('./Env');
const Room = require('./world/Room');
const DATA = require('./DATA');
const Player = require('./entities/Player');
const Editor = require('./entities/Editor');
const MouseControls = require('./MouseControls');
const KeyControls = require('./KeyControls');

class Game {

  constructor (dom) {
    this.dom = dom;
    this.events = Env.events;
    this.player = new Player();
    this.editor = new Editor();

    this.player.mesh.position.set(1, 0, 4);
    this.editor.mesh.position.set(1, 0, 4);

    this.controls = {
      mouse: new MouseControls(),
      keys: new KeyControls()
    };

    this.bindUI();

    this.bus = {
      fire: args => {
        if (args.type === 'set') {
          const {id, attr, value} = args;
          const item = this.room.items.find(i => i.id == id);
          if (item) {
            if (attr === "posx") item.mesh.position.x = value;
            if (attr === "posy") item.mesh.position.y = value;
            if (attr === "posz") item.mesh.position.z = value;
            if (attr === "rotx") item.mesh.rotation.x = value;
            if (attr === "roty") item.mesh.rotation.y = value;
            if (attr === "rotz") item.mesh.rotation.z = value;
            if (attr === "scalex") item.mesh.scale.x = value;
            if (attr === "scaley") item.mesh.scale.y = value;
            if (attr === "scalez") item.mesh.scale.z = value;
          }
        }
      },
      get: (id, attr) => {
        const item = this.room.items.find(i => i.id == id);
        var retVal = 0;
        if (item) {
          if (attr === "posx") retVal = item.mesh.position.x;
          if (attr === "posy") retVal = item.mesh.position.y;
          if (attr === "posz") retVal = item.mesh.position.z;
          if (attr === "rotx") retVal = item.mesh.rotation.x;
          if (attr === "roty") retVal = item.mesh.rotation.y;
          if (attr === "rotz") retVal = item.mesh.rotation.z;
          if (attr === "scalex") retVal = item.mesh.scale.x;
          if (attr === "scaley") retVal = item.mesh.scale.y;
          if (attr === "scalez") retVal = item.mesh.scale.z;
        }
        return retVal;
      }
    };

    this.loadRoom(DATA.bedroom);

    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.camera = new THREE.PerspectiveCamera( 65, 1, 0.1, 300);
    //this.player.mesh.add(this.camera);
    this.camera.position.y = 1.1;
    this.camera.position.x = -2;
    this.resize();

    this.dom.appendChild(this.renderer.domElement);
  }

  bindUI () {
    window.addEventListener('contextmenu', e => { e.preventDefault(); }, false);
    window.addEventListener('resize', this.resize.bind(this), false);
  }

  resize () {
    const {camera, renderer} = this;
    Env.width = Env.dom.clientWidth;
    Env.height = window.innerHeight;

    camera.aspect = Env.width / Env.height;
    camera.updateProjectionMatrix();
    renderer.setSize(Env.width, Env.height);
  }

  loadRoom (data) {
    if (this.room) {
      this.room.onLeave();
    }
    this.room = new Room(data, this.player);
    this.room.scene.add(this.player.mesh);
    this.room.scene.add(this.editor.mesh);
  }

  update () {
    const {renderer, camera, controls, raycaster, room} = this;
    room.update(renderer, camera, controls);
    controls.keys.pressed.forEach(p => {
      if (p.which === 192) {
        room.setViewer(room.viewer === this.player ? this.editor : this.player);
      }
    });

    controls.mouse.update();
    controls.keys.update();

  }

}

module.exports = Game;
