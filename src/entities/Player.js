const {THREE} = require('three');
const Env = require('../Env');

class Player {
  constructor () {
    this.hovering = null;
    this.selected = null;

    this.type = "Player";
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({color: 0x777777, wireframe:true});
    //this.mesh = new THREE.Object3D();
    this.mesh = new THREE.Mesh(geometry, material);

    this.raycaster = new THREE.Raycaster();
  }

  setSelected (selected) {
    if (this.selected && this.selected !== selected) {
      this.selected.isSelected = false;

      Env.events.emit('itemSelected', this.selected);
      this.selected.fireItem('itemDeselected');
    }
    this.selected = selected || null;
    if (this.selected && this.selected.mesh.visible) {
      this.selected.isSelected = true;
      this.selected.fireItem('itemSelected');
    }
    //Env.events.emit('selectionChange', this.selected);
    Env.events.emit('itemSelected', this.selected);
  }

  syncCam (camera) {
    camera.position.x = this.mesh.position.x;
    camera.position.z = this.mesh.position.z;
    camera.position.y = this.mesh.position.y + 1;
  }

  update (renderer, camera, room, {mouse, keys}) {
    const {left, right, forward, backward, up, down} = keys.move;
    const obj = this.mesh;
    if (this.selected && this.selected.type === "Computer") {
      keys.pressed.forEach(k => {
        room.onKeyDown(k);
      });
    } else {

      if (this.doSyncCam || left || right || forward || backward || up || down) {
        const amount = 0.05;

        if (left) obj.translateX(-amount);
        if (right) obj.translateX(amount);
        if (forward) obj.translateZ(-amount);
        if (backward) obj.translateZ(amount);
        if (up) obj.translateY(-amount);
        if (down) obj.translateY(amount);

        this.syncCam(camera);

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
        obj.rotation.y = camera.rotation.y;
      }
      if (dy) {
        camera.rotation.x += (dy > 0 ? 0.01 : -0.01) * Math.abs(dy * 80);
      }
    }

    if (mouse.left.clicked) {
      this.setSelected(this.hovering);
    }

  }
}

module.exports = Player;
