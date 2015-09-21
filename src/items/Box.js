const {THREE} = require('three');
const Item = require('./Item');

const geometry = new THREE.BoxGeometry( 1, 1, 1 );

class Box extends Item {

  constructor ({color}) {
    super();
    color = color || 0x956E46;
    this.type = "Box";
    const material = new THREE.MeshLambertMaterial({ color });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  update () {

  }

  get color () {
    return this.mesh.material.color.getHexString();
  }

  set color (col) {
    //console.log(col);
    //const color = new THREE.Color(col);
    console.log(col, this.mesh.material.color)
    this.mesh.material.color.setHex(col);
  }

}

module.exports = Box;
