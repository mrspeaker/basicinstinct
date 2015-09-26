const {THREE} = require('three');
const Env = require('../Env');

class Player {
  constructor () {
    this.hovering = null;
    this.selected = null;

    this.type = "Player";
    const geometry = new THREE.BoxGeometry(1, 0.5, 1);
    const material = new THREE.MeshLambertMaterial({color: 0x777777, wireframe:true});
    //this.mesh = new THREE.Object3D();
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.visible = false;
    this.raycaster = new THREE.Raycaster();

  }

  setSelected (selected) {
    if (this.selected && this.selected !== selected) {
      this.selected.isSelected = false;

      Env.events.emit('itemDeselected', this.selected);
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
    camera.position.y = this.mesh.position.y + 0.8;
  }

  update (renderer, camera, room, {mouse, keys}) {
    const {left, right, forward, backward, up, down} = keys.move;
    const obj = this.mesh;
    if (this.selected && this.selected.type === "Computer") {
      keys.pressed.forEach(k => {
        room.onKeyDown(k);
      });
    } else {
      const y = obj.position.y;
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
      obj.position.y = Math.max(-2, y);

    }

    const raycaster = this.raycaster;

    raycaster.setFromCamera(mouse.pos, camera);
    var intersections = raycaster.intersectObjects(room.scene.children, true);
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


    const feetPos = this.mesh.position.clone();
    feetPos.y -= 0.5;
    // Check up
    var hitAbove = false;
    raycaster.set(feetPos, new THREE.Vector3(0, 1, 0));
    intersections = raycaster.intersectObjects(room.scene.children, true);
    intersections = intersections.filter(i => i.object !== this.mesh);
    if (intersections.length > 0) {
      const inter = intersections[0].object;
      const floor = inter.userData.inst ? inter : inter.parent;
      if (floor.userData.inst && !floor.userData.inst.isRoof) {
        floor.geometry.computeBoundingBox();
        const h = floor.geometry.boundingBox.max.y - floor.geometry.boundingBox.min.y;
        this.mesh.position.y = floor.position.y + h + 0.25;
        hitAbove = true;
      }
    }

    if (!hitAbove) {
      // Check down.
      raycaster.set(feetPos, new THREE.Vector3(0, -1, 0));
      intersections = raycaster.intersectObjects(room.scene.children, true);
      intersections = intersections.filter(i => i.object !== this.mesh);
      if (intersections.length > 0) {
        const inter = intersections[0].object;
        const floor = inter.userData.inst ? inter : inter.parent;
        if (floor.userData.inst) {
          floor.geometry.computeBoundingBox();
          const h = floor.geometry.boundingBox.max.y - floor.geometry.boundingBox.min.y;
          this.mesh.position.y = floor.position.y + h + 0.25;
        }
      }
    }

    if (mouse.left.dragging) {
      const {dx, dy} = mouse.pos;
      const dragSpeed = -1.3;
      if (dx) {
        camera.rotation.y += dx * dragSpeed;
        // TODO: figure out better way to sync...
        obj.rotation.y = camera.rotation.y;
      }
      if (dy) {
        var rotx = camera.rotation.x;
        rotx -= dy * dragSpeed;
        camera.rotation.x = Math.min(0.7, Math.max(-0.7, rotx));
      }
    }

    if (mouse.left.clicked) {
      this.setSelected(this.hovering);
    }

  }
}

module.exports = Player;
