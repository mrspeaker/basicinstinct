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

    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 300);
    this.camera.position.x = 1;

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
      // Click
      if (this.hovering) {
        this.selected = this.hovering;
        this.selected.object.position.y += 0.1;
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
      }
    }, false);

    document.body.addEventListener('keydown', e => {
      this.room.onKeyDown(e);
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
    camera.position.z = 1 + (Math.sin(Date.now() / 3000) * 0.3);

    raycaster.setFromCamera(mouse, camera);

    const intersections = raycaster.intersectObjects(room.scene.children);
    if (intersections.length) {
      this.hovering = intersections[0];
    } else {
      this.hovering = null;
    }

  }

}

module.exports = Game;
