const {THREE} = require('three');

const geometry = new THREE.BoxGeometry(1, 1, 1);

class Cursor {

  constructor () {
    this.type = "Cursor";
    this.mesh = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry, 0.1),
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 0.3,
        transparent: true
      }));

  }

  wrapItem (i) {
    const {mesh} = this;
    if (i) {
      mesh.position.copy(i.mesh.position);
      mesh.rotation.copy(i.mesh.rotation);
      mesh.scale.copy(i.mesh.scale);
    } else {
      mesh.position.set(0, -100, 0);
    }
  }

}

module.exports = Cursor;
