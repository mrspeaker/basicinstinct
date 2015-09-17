const {THREE} = require('three');
const Room = require('./Room');
const DATA = require('./DATA');

class Game {

  constructor () {

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

    this.room = new Room(DATA.bedroom);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.1, 300);
    this.camera.position.x = 1;
    this.camera.position.z = 3;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersection = null;

    this.mouseDownTime = null;

    document.body.appendChild(this.renderer.domElement);

  }

  bindUI () {
    document.body.addEventListener('mousedown', e => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      this.mouseDownTime = Date.now();
      this.mouseDownPos = {x, y};
    }, false);
    document.body.addEventListener('mouseup', () => {
      if (Date.now() - this.mouseDownTime > 300) {
        this.mouseDownTime = null;
        return;
      }
      this.mouseDownTime = null;
      if (this.selected) {
        this.selected.isSelected = false;
      }
      // Click
      if (this.hovering) {
        this.selected = this.hovering;
        //this.selected.mesh.position.y += 0.1;
        this.selected.isSelected = true;
      } else {
        this.selected = null;
      }

    }, false);
    document.body.addEventListener('mousemove', e => {
      e.preventDefault();

      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (this.mouseDownTime && Date.now() - this.mouseDownTime > 50) {
        // Drag
        this.camera.rotation.y += this.mouseDownPos.x - this.mouse.x > 0 ? 0.01 : -0.01;
        this.camera.rotation.x += this.mouseDownPos.y - this.mouse.y > 0 ? -0.01 : 0.01;
      }
    }, false);

    document.body.addEventListener('keydown', e => {
      this.room.onKeyDown(e);

      if (this.selected && this.selected.type == "Computer") {
        // Don't move the computer.
        return;
      }
      const {which} = e;
      const up = which === 38 || which === 87;
      const down = which === 40 || which === 83;
      const left = which === 37 || which === 65;
      const right = which === 39 || which === 68;

      const obj = this.selected ? this.selected.mesh : this.camera;
      if (left) obj.position.x -= 0.1;
      if (right) obj.position.x += 0.1;
      if (up) obj.position.z -= 0.1;
      if (down) obj.position.z += 0.1;
    }, false);
    document.body.addEventListener('keyup', e => {
      this.room.onKeyUp(e);
    }, false);

    window.addEventListener('resize', this.resize.bind(this), false);
  }

  resize () {
    const {camera, renderer} = this;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  loadRoom (data) {
    if (this.room) {
      this.room.onLeave();
    }
    this.room = new Room(data);
  }

  update () {
    const {renderer, camera, raycaster, mouse, room} = this;
    room.update(renderer, camera);
    //camera.position.z = 1 + (Math.sin(Date.now() / 3000) * 0.3);

    raycaster.setFromCamera(mouse, camera);

    const intersections = raycaster.intersectObjects(room.scene.children);
    if (intersections.length) {
      this.hovering = intersections[0].object.userData.inst;
    } else {
      this.hovering = null;
    }

  }

}

module.exports = Game;
