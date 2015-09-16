const {THREE} = require('three');
const Room = require('./Room');
const ROOMDATA = require('./ROOMDATA');

class Game {

  constructor () {

    this.room = new Room(ROOMDATA.bedroom);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 300);
    this.camera.position.z = 2;

    document.body.appendChild(this.renderer.domElement);

  }

  loadRoom (data) {
    if (this.room) {
      this.room.onLeave();
    }
    this.room = new Room(data);
  }

  update () {
    this.room.update(this.renderer, this.camera);
    this.camera.position.z = 2 + Math.sin(Date.now() / 3000);
  }

}

module.exports = Game;
