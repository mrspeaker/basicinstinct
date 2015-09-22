const {THREE} = require('three');
const Env = require('./Env');
const Room = require('./world/Room');
const DATA = require('./DATA');
const Player = require('./entities/Player');
const {EventEmitter} = require('events');
const MouseControls = require('./MouseControls');
const KeyControls = require('./KeyControls');

class Game {

  setSelected (selected) {
    if (this.selected) {
      this.selected.isSelected = false;
    }
    this.selected = selected || null;
    if (this.selected) {
      this.selected.isSelected = true;
    }
    this.domFocused = true;
    this.events.emit('selectionChange', this.selected);
  }

  constructor (dom) {
    this.dom = dom;
    this.events = new EventEmitter();
    this.player = new Player();
    this.mouse = new MouseControls();
    this.keys = new KeyControls();

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

    this.room = new Room(DATA.bedroom, this.player);

    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.camera = new THREE.PerspectiveCamera( 65, 1, 0.1, 300);
    this.camera.position.x = 1;
    this.camera.position.z = 3;
    this.resize();

    this.raycaster = new THREE.Raycaster();
    this.intersection = null;

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
    this.room = new Room(data);
  }

  update () {
    const {renderer, camera, mouse, keys, raycaster, room} = this;
    room.update(renderer, camera);

    raycaster.setFromCamera(mouse.pos, camera);
    const intersections = raycaster.intersectObjects(room.scene.children);
    if (intersections.length) {
      this.hovering = intersections[0].object.userData.inst;
    } else {
      this.hovering = null;
    }
    if (this.selected && this.selected.type === "Computer") {
      keys.pressed.forEach(k => this.room.onKeyDown(k));
    } else {
      const {left, right, forward, backward, up, down} = keys.move;
      if (left || right || forward || backward || up || down) {
        const obj = camera;
        const amount = 0.05;

        if (left) obj.translateX(-amount);
        if (right) obj.translateX(amount);
        if (forward) obj.translateZ(-amount);
        if (backward) obj.translateZ(amount);
        if (up) obj.translateY(-amount);
        if (down) obj.translateY(amount);
      }
    }

    if (mouse.left.dragging) {
      const {dx, dy} = mouse.pos;
      if (dx) {
        camera.rotation.y += (dx > 0 ? -0.01 : 0.01) * Math.abs(dx * 80);
      }
      if (dy) {
        camera.rotation.x += (dy > 0 ? 0.01 : -0.01) * Math.abs(dy * 80);
      }
    }

    if (mouse.left.clicked) {
      this.setSelected(this.hovering);
    }

    mouse.update();
    keys.update();

  }

}

module.exports = Game;
