const {THREE} = require('three');
const {Computer, CRT} = require('ITSBasic');

class Compy {

  constructor () {
    this.tick = Math.random() * 10 | 0;

    const computer = new Computer();
    const screen = CRT(computer);

    const geometry = new THREE.BoxGeometry( 1.8, 1.2, 1 );
    const material = new THREE.MeshLambertMaterial( { color: 0x956E46 } );

    this.mesh = new THREE.Mesh( geometry, material );

    const screenTexture = new THREE.Texture(screen);
    const screenMaterial = new THREE.MeshLambertMaterial({
      map : screenTexture,
      side: THREE.DoubleSide
    });
    //screenMaterial.map.minFilter = THREE.NearestFilter;
    screenMaterial.map.minFilter = THREE.LinearFilter;
    const screenMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(screen.width, screen.height),
      screenMaterial);
    screenMesh.scale.set(0.005  , 0.005, 1);
    screenMesh.position.x = 0;
    screenMesh.position.y = 0;
    screenMesh.position.z = 0.501;

    this.mesh.add(screenMesh);
    this.texture = screenTexture;
    this.computer = computer;
  }

  update () {
    if (this.tick++ % 4 === 0) {
      this.texture.needsUpdate = true;
    }
    //this.mesh.rotation.y = Math.sin((this.tick/100) + (Date.now() / 3000)) * 0.7;
  }

}
module.exports = Compy;
