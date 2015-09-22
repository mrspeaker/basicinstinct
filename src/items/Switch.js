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

    this.togState = true;

    this.ons = {
      // When I get 'itemSelected', I want to send a 'toggleLight' to pointLight(4);
      'itemSelected': [{name:'toggleLight', to:16}],
      // how to do: if i get 'X' and I'm ON, send ....
      // how to do: if i get 'X' and [16, 8, 12] ON, send ....
      // how to do: if i get 'X' and I'm ON and 12 ENABLED, send ....
      // how to do: if i get 'X' 3 times, send ....
    };

  }

  fire (name) {
    const toEmit = this.ons[name] || [];

    if (name === 'itemSelected') {
      // onClick fires!
      this.togState = !this.togState;
      this.b2.position.y = this.togState ? 1 : 0.4;
    }

    if (name === 'itemDeselected') {
      console.log('I was unselected');
    }

    toEmit.forEach(msg => Env.events.emit('action', {...msg, from:this.id}));
  }

  get color () {
    return '0x' + this.b1.material.color.getHexString();
  }

  set color (col) {
    this.b1.material.color.setHex(col);
  }

}

module.exports = Switch;
