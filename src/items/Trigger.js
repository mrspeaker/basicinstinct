const {THREE} = require('three');
const Item = require('./Item');


const geometry = new THREE.BoxGeometry(1, 1, 1);

class Trigger extends Item {

  constructor (data) {
    super();

    this.type = "Trigger";
    this.invisible = true;

    var color = 0x956Eff;
    this.onTrigger = data.onTrigger;
    this.collidable = true;
    const material = new THREE.MeshBasicMaterial({ color, wireframe:true });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.visible = false;
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
