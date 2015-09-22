const {THREE} = require('three');
const Env = require('../Env');

class Editor {
  constructor () {
    this.hovering = null;
    this.selected = null;

    this.type = "Player";
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({color: 0x00dd00, wireframe:true});
    //this.mesh = new THREE.Object3D();
    this.mesh = new THREE.Mesh(geometry, material);

    this.raycaster = new THREE.Raycaster();
    this.intersection = null;

    //Env.events.on('starting', () => console.log('i got it.'))

  }

  setSelected (selected) {
    if (this.selected) {
      this.selected.isSelected = false;
    }
    this.selected = selected || null;
    if (this.selected) {
      this.selected.isSelected = true;
    }
    Env.events.emit('selectionChange', this.selected);
  }

  update (renderer, camera, room, {mouse, keys}) {
    const {left, right, forward, backward, up, down} = keys.move;

    if (left || right || forward || backward || up || down) {
      const obj = this.selected ? this.selected.mesh : this.mesh;


      const amount = 0.05;
      if (left) obj.translateX(-amount);
      if (right) obj.translateX(amount);
      if (forward) obj.translateZ(-amount);
      if (backward) obj.translateZ(amount);
      if (up) obj.translateY(-amount);
      if (down) obj.translateY(amount);

      if (!this.selected) {
        camera.position.x = obj.position.x;
        camera.position.z = obj.position.z;
        camera.position.y = obj.position.y + 1;
      }

    }

    const raycaster = this.raycaster;

    raycaster.setFromCamera(mouse.pos, camera);
    const intersections = raycaster.intersectObjects(room.scene.children);
    if (intersections.length) {
      this.hovering = intersections[0].object.userData.inst;
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

  }
}

module.exports = Editor;
