const {THREE} = require('three');

const geometry = new THREE.BoxGeometry( 1, 1, 1 );

class Box {

  constructor ({color}) {
    color = color || 0x956E46;
    this.type = "Box";
    const material = new THREE.MeshLambertMaterial({ color });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  update () {

  }

}

module.exports = Box;
