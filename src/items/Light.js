const {THREE} = require('three');
const Item = require('./Item');

class Light extends Item {

  constructor () {
    super();
    this.type = "Light";
    this.mesh = new THREE.Object3D();

    this.point = new THREE.PointLight(0xFEFDCD, 1, 11);
    this.mesh.add(this.point);
    const ph = new THREE.PointLightHelper(this.point, 0.1);
    ph.matrix = this.point.matrix;
    this.mesh.add(ph);
  }

  fire (name) {
    if (name === 'toggleLight') {
      this.point.visible = !this.point.visible;
    }
  }

}

Light.defn = {
  args: {

  }
};

module.exports = Light;
