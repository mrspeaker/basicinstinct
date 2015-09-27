const {THREE} = require('three');
const {Computer, CRT} = require('ITSBasic');
const Item = require('./Item');

const geometry = new THREE.BoxGeometry( 1.8, 1.2, 1 );
const material = new THREE.MeshLambertMaterial( { color: 0x252526 } );

class Compy extends Item {

  constructor ({program}) {
    super();
    this.tick = Math.random() * 10 | 0;
    this.type = "Computer";
    this.collidable = true;

    const computer = new Computer();
    const screen = CRT(computer);

    this.mesh = new THREE.Mesh( geometry, material );

    const screenTexture = new THREE.Texture(screen);
    const screenMaterial = new THREE.MeshBasicMaterial({
      map : screenTexture,
      side: THREE.DoubleSide
    });
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
    setTimeout(() => {
      //his.computer.execInstructionLine('load("spin")');
      //this.computer.execInstructionLine('print("hello. ' + Math.random() + '")');
      //this.computer.run();
      if (program) {
        this.computer.load(program);
        this.computer.run();
      }
    }, 100);

  }

  on (eventName, event) {
    if (!this.isSelected) {
      return;
    }
    switch (eventName) {
    case 'keydown':
      this.computer.keys.down(event);
      break;
    case 'keyup':
      this.computer.keys.up(event);
      break;
    }
  }

  update () {
    if (this.tick++ % 4 === 0) {
      this.texture.needsUpdate = true;
    }
  }

}

Computer.defn = {
  args: {

  }
};

module.exports = Compy;
