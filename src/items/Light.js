const {THREE} = require('three');
const Item = require('./Item');

class Light extends Item {

  constructor () {
    super();
    this.type = "Light";
    this.mesh = new THREE.Object3D();

    this.point = new THREE.PointLight(0xFCEAD5, 2.5, 7.5);
    //this.point.visible = true;
    this.mesh.add(this.point);
    this.mesh.add(new THREE.PointLightHelper(this.point, 0.1));
  }

  fire (name) {
    if (name === 'toggleLight') {
      this.point.visible = !this.point.visible;
    }
  }

}

module.exports = Light;
