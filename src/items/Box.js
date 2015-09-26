const {THREE} = require('three');
const Item = require('./Item');

const geometry = new THREE.BoxGeometry(1, 1, 1);

class Box extends Item {

  constructor ({
      color=0x956E46,
      roof=false} = {}) {
    super();
    this.type = "Box";
    const material = new THREE.MeshPhongMaterial({ color });
    material.shininess = 5;
    this.mesh = new THREE.Mesh(geometry, material);
    this.isRoof = roof;
  }

  fire (name) {

    if (name === 'itemSelected') {
      // onClick fires!
    }

    if (name === 'itemDeselected') {
      // onCilck somewhere ele
    }

  }

  get color () {
    return '0x' + this.mesh.material.color.getHexString();
  }

  set color (col) {
    this.mesh.material.color.setHex(col);
  }

}

Box.defn = {
  args: {
    color: 0x956E46,
    roof: false
  }
};

module.exports = Box;
