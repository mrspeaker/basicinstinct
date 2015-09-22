const {THREE} = require('three');
const Room = require('./world/Room');
const DATA = require('./DATA');
const Player = require('./entities/Player');
const {EventEmitter} = require('events');
const MouseControls = require('./MouseControls');

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

    this.move = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false,
      shift: false
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

    this.room = new Room(DATA.bedroom, this.player);

    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setSize(this.dom.clientWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera( 65, this.dom.clientWidth / window.innerHeight, 0.1, 300);
    this.camera.position.x = 1;
    this.camera.position.z = 3;

    this.raycaster = new THREE.Raycaster();
    this.intersection = null;

    this.dom.appendChild(this.renderer.domElement);

  }

  bindUI () {

    document.body.addEventListener('keydown', e => {
      if (!this.domFocused) {
        return;
      }
      this.room.onKeyDown(e);

      const {which} = e;
      if (e.shiftKey) this.move.shift = true;
      // WSAD / Keys
      if (which === 38 || which === 87) { this.move.forward = true; }
      if (which === 40 || which === 83) { this.move.backward = true; }
      if (which === 37 || which === 65) { this.move.left = true; }
      if (which === 39 || which === 68) { this.move.right = true; }
      if (which === 81) { this.move.up = true; }
      if (which === 69) { this.move.down = true; }

    }, false);
    
    document.body.addEventListener('keyup', e => {
      if (!this.domFocused) {
        return;
      }

      this.room.onKeyUp(e);
      const {which} = e;
      if (!e.shiftKey) this.move.shift = false;
      const forward = which === 38 || which === 87;
      const backward = which === 40 || which === 83;
      const left = which === 37 || which === 65;
      const right = which === 39 || which === 68;
      const up = which === 81;
      const down = which === 69;
      if (forward) { this.move.forward = false; }
      if (backward) { this.move.backward = false; }
      if (left) { this.move.left = false; }
      if (right) { this.move.right = false; }
      if (up) { this.move.up = false; }
      if (down) { this.move.down = false; }
    }, false);

    window.addEventListener('contextmenu', e => { e.preventDefault(); }, false);
    window.addEventListener('resize', this.resize.bind(this), false);
  }

  resize () {
    const {camera, renderer} = this;
    camera.aspect = this.dom.clientWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(this.dom.clientWidth, window.innerHeight);
  }

  loadRoom (data) {
    if (this.room) {
      this.room.onLeave();
    }
    this.room = new Room(data);
  }

  update () {
    const {renderer, camera, mouse, raycaster, room, move} = this;

    room.update(renderer, camera);

    raycaster.setFromCamera(mouse.pos, camera);
    const intersections = raycaster.intersectObjects(room.scene.children);
    if (intersections.length) {
      this.hovering = intersections[0].object.userData.inst;
    } else {
      this.hovering = null;
    }

    const {left, right, forward, backward, up, down} = move;
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

  }

}

module.exports = Game;
