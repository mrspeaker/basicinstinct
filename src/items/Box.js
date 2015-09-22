const {THREE} = require('three');
const Item = require('./Item');

const geometry = new THREE.BoxGeometry(1, 1, 1);

class Box extends Item {

  constructor ({color}) {
    super();
    color = color || 0x956E46;
    this.type = "Box";
    const material = new THREE.MeshLambertMaterial({ color });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  get color () {
    return '0x' + this.mesh.material.color.getHexString();
  }

  set color (col) {
    this.mesh.material.color.setHex(col);
  }

}

module.exports = Box;
