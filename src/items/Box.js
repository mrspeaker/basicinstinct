const {THREE} = require('three');
const Item = require('./Item');

const geometry = new THREE.BoxGeometry(1, 1, 1);

class Box extends Item {

  constructor ({
      color=0x956E46,
      roof=false,
      tex} = {}) {
    super();
    this.type = "Box";
    const params = {
      color,
    };
    if (tex) {
      const map = THREE.ImageUtils.loadTexture("res/images/" + tex + ".jpg");
      map.minFilter = map.magFilter = THREE.NearestFilter;
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(12, 12);
      params.map = map;

    }
    const material = new THREE.MeshPhongMaterial(params);

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
