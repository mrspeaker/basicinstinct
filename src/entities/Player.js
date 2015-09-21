const {THREE} = require('three');

class Player {
  constructor () {
    this.type = "Player";
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshLambertMaterial({color: 0x777777, wireframe:true});
    this.mesh = new THREE.Mesh(geometry, material);
  }

  on (e) {
    // Handle all the events.
  }

}

module.exports = Player;
