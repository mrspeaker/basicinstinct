const {THREE} = require('three');
const Item = require('./Item');
const Env = require('../Env');

const geometry = new THREE.BoxGeometry(1, 1, 1);

class Switch extends Item {

  constructor ({color}) {
    super();
    color = color || 0x956E46;
    this.type = "Switch";
    const material = new THREE.MeshLambertMaterial({ color });
    this.mesh = new THREE.Object3D();

    this.b1 = new THREE.Mesh(geometry, material);
    this.b2 = new THREE.Mesh(geometry, material);
    this.b2.scale.set(0.2, 0.2, 0.2);
    this.b2.position.set(0, 1, 0);

    this.mesh.add(this.b1);
    this.mesh.add(this.b2);

    this.up = true;
  }

  update () {

  }

  switchIt() {
    this.up = !this.up;
    this.b2.position.y = this.up ? 1 : 0.4;
    Env.events.emit('switch', this);
  }

  get color () {
    return '0x' + this.b1.mesh.material.color.getHexString();
  }

  set color (col) {
    this.b1.mesh.material.color.setHex(col);
  }

}

module.exports = Switch;
