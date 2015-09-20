const Rx = require('rx');
const React = require('react');
const {THREE} = require('three');
const Room = require('./Room');
const DATA = require('./DATA');
const SideBar = require('./editor/SideBar');

class Game {

  setSelected (selected) {
    if (this.selected) {
      this.selected.isSelected = false;
    }
    this.selected = selected || null;
    if (this.selected) {
      this.selected.isSelected = true;
    }

    this.updateUI();

  }

  changey (attr, index, val) {
    //this.selected.onChange(attr, index, val);
    this.updateUI();
  }

  updateUI () {
    React.render(
      <SideBar selected={this.selected} onChange={this.changey} />,
      document.getElementById('sidebar')
    );
  }

  constructor () {
    this.changey = this.changey.bind(this);
    this.dom = document.querySelector('#main');


    /*const src = Rx.Observable.create(observer => {
      observer.onNext(42);
      observer.onCompleted();

      return () => console.log('lol');
    });*/
    const src = Rx.Observable.range(1, 5);

    var sub = src.subscribe(
      x => console.log('Next!', x),
      e => console.error(e),
      () => console.log('done')
    );

    sub.dispose();

    this.mode = "position";

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

    this.room = new Room(DATA.bedroom);
    this.renderer = new THREE.WebGLRenderer({antialias:true});

    this.renderer.setSize(this.dom.clientWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera( 65, this.dom.clientWidth / window.innerHeight, 0.1, 300);
    this.camera.position.x = 1;
    this.camera.position.z = 3;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersection = null;

    this.mouseDownTime = null;

    document.querySelector('#main').appendChild(this.renderer.domElement);

  }

  bindUI () {
    const dom = this.dom;
    dom.addEventListener('mousedown', e => {
      const x = (e.clientX / this.dom.clientWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      const rmb = e.which === 3;
      this.mouseDownTime = Date.now();
      this.mouseDownPos = {x, y, rmb};

    }, false);
    dom.addEventListener('mouseup', () => {
      if (Date.now() - this.mouseDownTime > 300) {
        this.mouseDownTime = null;
        return;
      }
      this.mouseDownTime = null;

      // Click
      this.mode = "position";
      document.querySelector('#mode').textContent = this.mode;
      if (this.hovering) {
        if (this.mouseDownPos.rmb) {
          // Right click!
          console.log('do something with:', this.hovering);
        } else {
          this.setSelected(this.hovering);
        }
      } else {
        this.setSelected();
      }
      document.querySelector('#selected').textContent = this.selected ? this.selected.id + ' ' + this.selected.type : '-';


    }, false);
    dom.addEventListener('mouseleave', () => {
      this.mouseDownTime = null;
    });
    dom.addEventListener('mousemove', e => {
      e.preventDefault();

      this.mouse.x = (e.clientX / this.dom.clientWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Drag
      if (!this.mouseDownPos || !this.mouseDownTime) {
        return;
      }
      const diffX = this.mouseDownPos.x - this.mouse.x;
      const diffY = this.mouseDownPos.y - this.mouse.y;
      if (diffX !== 0) {
        this.camera.rotation.y += (diffX > 0 ? -0.01 : 0.01) * Math.abs(diffX * 80);
        this.mouseDownPos.x = this.mouse.x;
      }
      if (diffY !== 0) {
        this.camera.rotation.x += (diffY > 0 ? 0.01 : -0.01) * Math.abs(diffY * 80);
        this.mouseDownPos.y = this.mouse.y;
      }
    }, false);

    document.body.addEventListener('keydown', e => {
      this.room.onKeyDown(e);

      if (this.selected && this.selected.type == "Computer") {
        // Don't move the computer.
        return;
      }
      const {which} = e;

      if (e.shiftKey) this.move.shift = true;
      // WSAD / Keys
      if (which === 38 || which === 87) { this.move.forward = true; }
      if (which === 40 || which === 83) { this.move.backward = true; }
      if (which === 37 || which === 65) { this.move.left = true; }
      if (which === 39 || which === 68) { this.move.right = true; }
      if (which === 81) { this.move.up = true; }
      if (which === 69) { this.move.down = true; }

      if (which >= 49 && which <= 51) { // 1,2,3
        if (which === 49) {this.mode = "position";}
        if (which === 50) {this.mode = "scale";}
        if (which === 51) {this.mode = "rotation";}
        document.querySelector('#mode').textContent = this.mode;
      }

      // Duplicate item!
      if (this.selected && which === 90) {
        this.setSelected(this.room.addItem(this.room.getDefn(this.selected)))
        this.selected.mesh.position.y += 0.2;
      }

    }, false);
    document.body.addEventListener('keyup', e => {
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

    const {left, right, forward, backward, up, down} = this.move;
    const obj = this.selected ? this.selected.mesh : this.camera;
    const mode = obj === this.camera ? "position" : this.mode;
    var amount = this.mode === "rotation" ? Math.PI / 20 : 0.05;

    // Move camera fast by default, slow with shift
    if (obj === this.camera) {
      amount *= this.move.shift ? 0.05: 1;
    } else {
      amount *= this.move.shift ? 1: 0.05;
    }

    if (left) obj[mode].x -= amount;
    if (right) obj[mode].x += amount;
    if (forward) {
      if (mode === "position") {
        obj.translateZ(-amount);
      } else {
        obj[mode].z -= amount;
      }
    }
    if (backward) {
      if (mode === "position") {
        obj.translateZ(amount);
      } else {
        obj[mode].z += amount;
      }
    }
    if (up) obj[mode].y -= amount;
    if (down) obj[mode].y += amount;
    if (mode === "scale") {
      // No 0 size!
      obj.scale.x = Math.max(0.01, obj.scale.x);
      obj.scale.y = Math.max(0.01, obj.scale.y);
      obj.scale.z = Math.max(0.01, obj.scale.z);
    }

    this.updateUI()

  }

}

module.exports = Game;
