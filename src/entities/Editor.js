const {THREE} = require('three');
const Viewer = require('./Viewer');
const Env = require('../Env');
const Items = require('../items/');

class Editor extends Viewer {
  constructor () {
    super();
    this.mode = "position";

    this.type = "Editor";
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00dd00, wireframe:true});
    //this.mesh = new THREE.Object3D();
    this.mesh = new THREE.Mesh(geometry, material);
    this.invisible = true;
    this.mesh.visible = !this.invisible;

    this.ui = document.querySelector("#edui");
    this.clickAdd = this.clickAdd.bind(this);
    Object.keys(Items).map(k => {
      const but = document.createElement('button');
      but.setAttribute('data-name', k);
      but.textContent = k;
      but.addEventListener('click', this.clickAdd, false);
      return but;
    }).map(b => this.ui.appendChild(b));
  }

  clickAdd (e) {
    const type = e.target.getAttribute('data-name');
    Env.events.emit('addNewItem', type);
  }

  toggleUI (isOn) {
    const dom = document.querySelector('#edui');
    if (!dom) { return; }
    dom.style.display = isOn ? 'block' : 'none';
  }

  update (renderer, camera, room, {mouse, keys}) {
    const {left, right, forward, backward, up, down} = keys.move;

    if (this.doSyncCam ||  left || right || forward || backward || up || down) {
      const isViewer = !this.selected;
      const obj = isViewer ? this.mesh : this.selected.mesh;
      const mode = this.mode;
      var amount = mode === "rotation" ? Math.PI / 20 : 0.05;

      // Move camera fast by default, slow with shift
      if (isViewer) {
        amount *= keys.move.shift ? 0.08: 1;
      } else {
        amount *= keys.move.shift ? 1: 0.05;
      }

      if (left) {
        if (mode === "position") obj.translateX(-amount);
        else obj[mode].x -= amount;
      }
      if (right) {
        if (mode === "position") obj.translateX(amount);
        else obj[mode].x += amount;
      }
      if (forward) {
        if (mode === "position") obj.translateZ(-amount);
        else obj[mode].z -= amount;
      }
      if (backward) {
        if (mode === "position") obj.translateZ(amount);
        else obj[mode].z += amount;
      }
      if (up) {
        if (mode === "position") obj.translateY(-amount);
        else obj[mode].y -= amount;
      }
      if (down) {
        if (mode === "position") obj.translateY(amount);
        else obj[mode].y += amount;
      }
      if (mode === "scale") {
        // No 0 size!
        obj.scale.x = Math.max(0.01, obj.scale.x);
        obj.scale.y = Math.max(0.01, obj.scale.y);
        obj.scale.z = Math.max(0.01, obj.scale.z);
      }

      if (isViewer) {
        this.syncCam(camera);
      } else {
        Env.events.emit('selectionChange', this.selected);
      }

    }

    // Check under mouse
    this.hovering = this.raycast(room.scene.children, mouse.pos, camera)[0] || null;
    if (mouse.right.clicked) {
      this.setSelected(this.hovering);
    }

    if (mouse.left.dragging) {
      const {dx, dy} = mouse.pos;
      const dragSpeed = -1.3;
      if (dx) {
        camera.rotation.y += dx * dragSpeed;
        // TODO: figure out better way to sync...
        this.mesh.rotation.y = camera.rotation.y;
      }
      if (dy) {
        camera.rotation.x -= dy * dragSpeed;
      }
    }

    if (this.selected) {

      keys.pressed.forEach(k => {
        switch (k.which) {
        case 27: /*esc*/
          this.setSelected(null);
          break;
        case 90:
          // Duplicate selected object
          this.setSelected(room.addItem(room.getDefn(this.selected)));
          this.selected.mesh.position.y += 0.2;
          break;
        case 88:
          room.removeItem(this.selected);
          this.setSelected(null);
          // Remove selected.
          break;
        case 49: this.mode = "position"; break;
        case 50: this.mode = "scale"; break;
        case 51: this.mode = "rotation"; break;

        }
      });
    }

  }
}

module.exports = Editor;
