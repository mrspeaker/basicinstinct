const {THREE} = require('three');
const Item = require('./Item');


const geometry = new THREE.BoxGeometry(1, 1, 1);

class Trigger extends Item {

  constructor () {
    super();
    var color = 0x956Eff;
    this.type = "Trigger";
    this.collidable = true;
    const material = new THREE.MeshLambertMaterial({ color, wireframe:true });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  fire (name) {

    if (name === 'itemSelected') {
      // onClick fires!
    }

    if (name === 'itemDeselected') {
      // onCilck somewhere ele
    }

  }

}

module.exports = Trigger;
