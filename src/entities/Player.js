const {THREE} = require('three');
const Viewer = require('./Viewer');
const translateWithKeys = require('../behaviours/translateWithKeys');
const dragView = require('../behaviours/dragView');
const Fallable = require('../behaviours/Fallable');

class Player extends Viewer {
  constructor () {
    super();
    this.type = "Player";
    const geometry = new THREE.BoxGeometry(1, 0.5, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x777777, wireframe:true});

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.visible = false;

    this.initGUI();
  }

  initGUI () {
    // TODO: move this to world. Communicate via events.
    const gui = this.gui = document.querySelector('#gui');
    const listing = this.guiListing = gui.querySelector('#listing');
    listing.style.display = 'none';
    listing.querySelector('.close').addEventListener('click', () => {
      listing.style.display = 'none';
    }, false);
    const popup = this.guiPopup = gui.querySelector('#popup');
    popup.querySelector('.close').addEventListener('click', () => {
      popup.style.display = 'none';
    }, false);
  }

  toggleUI (isOn) {
    this.gui.style.display = isOn ? 'block' : 'none';
  }

  showListing (text) {
    this.guiListing.style.display = 'block';
    this.guiListing.querySelector('.content').innerHTML = text.replace(/\n/g, '<br/>');
  }

  handleMoveAndComputerKeys (keys, room) {
    const {mesh, selected} = this;
    const usingComputer = selected && selected.type === "Computer";

    if (usingComputer) {
      // Send keystrokes to computer
      keys.pressed.forEach(k => room.onKeyDown(k));
      return;
    }
    // Handle controls
    translateWithKeys(mesh, keys, 0.05);
  }

  checkAboveAndBelowCollisions (children) {
    const {position:pos} = this;
    const playerHeight = 1.0;
    const halfHeight = playerHeight / 2;

    const headPos = {x: pos.x, y: pos.y + halfHeight, z: pos.z};
    const feetPos = headPos.y - playerHeight;
    const DOWN = new THREE.Vector3(0, -1, 0);

    // Check down.
    const below = this.raycast(children, headPos, DOWN)[0] || null;
    if (below) {
      const geom = below.mesh.geometry;
      geom.computeBoundingBox();
      const geomHalfHeight = (geom.boundingBox.max.y - geom.boundingBox.min.y) / 2;
      const floorY = below.mesh.position.y + geomHalfHeight;
      this.fall(feetPos > floorY);
      const newFeetPos = pos.y - halfHeight;
      this.position.y = Math.max(newFeetPos, floorY + halfHeight);
    }


    //      _____
    //     |     |
    //     |  .  |
    //     | / \ |
    //     |/___\|
    //     /     \
    //
    // for (var vertexIndex = 0; vertexIndex < Player.geometry.vertices.length; vertexIndex++) {
    //     var localVertex = Player.geometry.vertices[vertexIndex].clone();
    //     var globalVertex = Player.matrix.multiplyVector3(localVertex);
    //
    //     //var vector = object.geometry.vertices[i].clone();
    //     //vector.applyMatrix4(object.matrixWorld);
    //
    //     var directionVector = globalVertex.subSelf( Player.position );
    //
    //     var ray = new THREE.Ray( Player.position, directionVector.clone().normalize() );
    //     var collisionResults = ray.intersectObjects(collidableMeshList);
    //     if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
    //         // a collision occurred... do something...
    //     }
    // }

  }

  update (renderer, camera, room, {mouse, keys}) {
    const {rotation} = this;
    const children = room.scene.children;

    dragView(mouse, rotation, camera.rotation);
    this.handleMoveAndComputerKeys(keys, room);
     // Get hovered / selected item
    this.hovering = this.raycast(children, mouse.pos, camera)[0];
    if (mouse.left.clicked) {
      this.setSelected(this.hovering);
    }

    this.checkAboveAndBelowCollisions(children); // Some basic collisions...
    this.syncCamera(camera);
  }
}

module.exports = Fallable(Player);
