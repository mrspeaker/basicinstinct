const {THREE} = require('three');
const Viewer = require('./Viewer');

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
    this.gui = document.querySelector('#gui');
    this.guiListing = this.gui.querySelector('#listing');
    this.guiListing.style.display = 'none';
    this.guiListing.querySelector('.close').addEventListener('click', () => {
      this.guiListing.style.display = 'none';
    }, false);
    this.guiPopup = this.gui.querySelector('#popup');
    this.guiPopup.querySelector('.close').addEventListener('click', () => {
      this.guiPopup.style.display = 'none';
    }, false);
  }

  toggleUI (isOn) {
    this.gui.style.display = isOn ? 'block' : 'none';
  }

  showListing (text) {
    this.guiListing.style.display = 'block';
    this.guiListing.querySelector('.content').innerHTML = text.replace(/\n/g, '<br/>');
  }

  update (renderer, camera, room, {mouse, keys}) {
    const {selected, mesh} = this;
    const {left, right, forward, backward, up, down} = keys.move;
    const usingComputer = selected && selected.type === "Computer";
    const children = room.scene.children;

    if (usingComputer) {
      // Send keystrokes to computer
      keys.pressed.forEach(k => room.onKeyDown(k));
    } else {
      // Handle controls
      const origY = mesh.position.y;
      if (this.doSyncCam || left || right || forward || backward || up || down) {
        const amount = 0.05;

        if (left) mesh.translateX(-amount);
        if (right) mesh.translateX(amount);
        if (forward) mesh.translateZ(-amount);
        if (backward) mesh.translateZ(amount);
        if (up) mesh.translateY(-amount);
        if (down) mesh.translateY(amount);
      }
      mesh.position.y = Math.max(-2, origY);

    }

    // Drag view
    if (mouse.left.dragging) {
      const {dx, dy} = mouse.pos;
      const dragSpeed = -1.3;
      if (dx) {
        camera.rotation.y += dx * dragSpeed;
        // TODO: figure out better way to sync...
        mesh.rotation.y = camera.rotation.y;
      }
      if (dy) {
        var rotx = camera.rotation.x;
        rotx -= dy * dragSpeed;
        camera.rotation.x = Math.min(0.7, Math.max(-0.7, rotx));
      }
    }

    // Check under mouse
    this.hovering = this.raycast(room.scene.children, mouse.pos, camera)[0] || null;
    if (mouse.left.clicked) {
      this.setSelected(this.hovering);
    }

    // Some collisions...

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

    const feetPos = mesh.position.clone();
    feetPos.y -= 0.5;
    const UP = new THREE.Vector3(0, 1, 0);
    const DOWN = new THREE.Vector3(0, -1, 0);

    // Check up
    var hitAbove = false;
    const floor = this.raycast(children, feetPos, UP)[0] || null;

    if (floor && !floor.isRoof) {
      const geom = floor.mesh.geometry;
      // FIXME: doesn't hit geom of complex obj...
      geom.computeBoundingBox();
      const h = geom.boundingBox.max.y - geom.boundingBox.min.y;
      mesh.position.y = floor.mesh.position.y + h + 0.25;
      hitAbove = true;
    }

    if (!hitAbove) {
      // Check down.
      const floor = this.raycast(children, feetPos, DOWN)[0] || null;
      if (floor) {
        const geom = floor.mesh.geometry;
        geom.computeBoundingBox();
        const h = geom.boundingBox.max.y - geom.boundingBox.min.y;
        const curY = mesh.position.y;
        mesh.position.y = Math.max(curY - 0.08, floor.mesh.position.y + h + 0.25);
      }
    }

    this.syncCam(camera);
  }
}

module.exports = Player;
