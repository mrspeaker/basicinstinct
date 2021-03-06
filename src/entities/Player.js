/* @flow */
const {THREE} = require('three');
const Viewer = require('./Viewer');
const translateWithKeys = require('../behaviours/translateWithKeys');
const dragView = require('../behaviours/dragView');
const vertexCollision = require('../behaviours/vertexCollision');
const Fallable = require('../behaviours/Fallable');

const raycaster = require('../behaviours/raycaster');

const Keys = require('../controls/KeyControls');
const Room = require('../world/Room');
const Controls = require('../controls/');

class Player extends Viewer {

  gui: HTMLElement;
  guiListing: HTMLElement;
  guiPopup: HTMLElement;

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

  toggleUI (isOn: boolean) {
    this.gui.style.display = isOn ? 'block' : 'none';
  }

  showListing (text: string) {
    this.guiListing.style.display = 'block';
    this.guiListing.querySelector('.content').innerHTML = text.replace(/\n/g, '<br/>');
  }

  handleMoveAndComputerKeys (keys: Keys, room: Room) {
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

  checkGroundCollisions (children: Array<THREE.Object3d>) {
    const {position:pos} = this;
    const playerHeight = 1.0;
    const halfHeight = playerHeight / 2;

    const headPos = {x: pos.x, y: pos.y + halfHeight, z: pos.z};
    const feetPos = headPos.y - playerHeight;
    const DOWN = new THREE.Vector3(0, -1, 0);

    // Check down.
    const below = raycaster(children, headPos, DOWN)[0] || null;
    if (below) {
      const {object} = below;
      if (object) {
        const belowMesh = object.mesh;
        const geom = belowMesh.geometry;
        geom.computeBoundingBox();
        const geomHalfHeight = (geom.boundingBox.max.y - geom.boundingBox.min.y) / 2;
        const floorY = belowMesh.position.y + geomHalfHeight;
        this.fall(feetPos > floorY);
        const newFeetPos = pos.y - halfHeight;
        if (newFeetPos < floorY + halfHeight) {
          pos.y = floorY + halfHeight;
        }
      }
    }
  }

  update (camera: THREE.PerspectiveCamera, room:Room, {mouse, keys}:Controls) {
    const {rotation, mesh} = this;
    const children = room.scene.children;

    dragView(mouse, rotation, camera.rotation);
    this.handleMoveAndComputerKeys(keys, room);
     // Get hovered / selected item
    const hits = raycaster(children, mouse.pos, camera);
    this.hovering = hits[0] ? hits[0].object : null;
    if (mouse.left.clicked) {
      this.setSelected(this.hovering);
    }

    this.checkGroundCollisions(children); // Some basic collisions...

    // var head = h[0] || h[1] || h[4] || h[5] ; // [ true, true, false, false, true, true, false, false ]
    // var foot = h[2] || h[3] || h[6] || h[7] ; // [ false, false, true, true, false, false, true, true ]
    // var rr = h[0] || h[1] || h[2] || h[3] ; // [ true, true, true, true, false, false, false, false ]
    // var ll = h[4] || h[5] || h[6] || h[7] ; // [ false, false, false, false, true, true, true, true ]
    // var back = h[0] || h[2] || h[5] || h[7] ; // [ true, false, true, false, false, true, false, true ]
    // var fwd = h[1] || h[3] || h[4] || h[6] ; // [ false, true, false, true, true, false, true, false ]

    mesh.updateMatrixWorld();
    const h = vertexCollision(mesh, children);
    const point = h.filter(v => !!v)[0] || null;
    if (point) {
      mesh.position.addScaledVector(point.face.normal, -point.rest);
    }

    if (keys.keys[32] && keys.keys[32].pressed) {
      keys.keys[32].pressed = false; // wha?! should be done automagically.
      this.setV(-0.054);
      this.mesh.translateY(0.5);
    }


    this.syncCamera(camera);
  }
}

module.exports = Fallable(Player);
