const {THREE} = require('three');
const Env = require('../Env');

class Editor {
  constructor () {
    this.hovering = null;
    this.selected = null;
    this.mode = "position";

    this.type = "Player";
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({color: 0x00dd00, wireframe:true});
    //this.mesh = new THREE.Object3D();
    this.mesh = new THREE.Mesh(geometry, material);

    this.raycaster = new THREE.Raycaster();
  }

  setSelected (selected) {
    if (this.selected) {
      this.selected.isSelected = false;
    }
    this.selected = selected || null;
    if (this.selected) {
      this.selected.isSelected = true;
    }
    this.mode = "position";
    Env.events.emit('selectionChange', this.selected);
  }

  syncCam (camera) {
    camera.position.x = this.mesh.position.x;
    camera.position.z = this.mesh.position.z;
    camera.position.y = this.mesh.position.y + 1;
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
        amount *= keys.move.shift ? 0.05: 1;
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

    const raycaster = this.raycaster;

    raycaster.setFromCamera(mouse.pos, camera);
    const intersections = raycaster.intersectObjects(room.scene.children, true);
    if (intersections.length) {
      const hovering = intersections[0].object.userData.inst ? intersections[0].object : intersections[0].object.parent;
      if (!hovering.userData.inst) {
        //'didnt really fix this')
        this.hovering = null;
      } else {
        this.hovering = hovering.userData.inst;
      }
    } else {
      this.hovering = null;
    }

    if (mouse.left.dragging) {
      const {dx, dy} = mouse.pos;
      if (dx) {
        camera.rotation.y += (dx > 0 ? -0.01 : 0.01) * Math.abs(dx * 80);
        // TODO: figure out better way to sync...
        this.mesh.rotation.y = camera.rotation.y;
      }
      if (dy) {
        camera.rotation.x += (dy > 0 ? 0.01 : -0.01) * Math.abs(dy * 80);
      }
    }

    if (mouse.left.clicked) {
      this.setSelected(this.hovering);
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
        case 49: this.mode = "position"; break;
        case 50: this.mode = "scale"; break;
        case 51: this.mode = "rotation"; break;

        }
      });
    }

  }
}

module.exports = Editor;
