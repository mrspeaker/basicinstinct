/* @flow */

const {THREE} = require('three');
const Env = require('./Env');
const World = require('./world/World');
const Controls = require('./controls/');

class Game {

  world: World;
  controls: Controls;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;

  constructor () {


    this.world = new World();
    this.controls = new Controls();

    // Add renderer and camera
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.camera = new THREE.PerspectiveCamera(65, 1, 0.1, 300);
    this.camera.rotation.order = "YXZ";
    Env.dom.appendChild(this.renderer.domElement);
    this.resize();

    this.bindUI();
  }

  bindUI () {
    window.addEventListener('contextmenu', e => { e.preventDefault(); }, false);
    window.addEventListener('resize', this.resize.bind(this), false);
  }

  resize () {
    const {camera, renderer} = this;
    Env.width = Env.dom.clientWidth;
    Env.height = window.innerHeight;

    camera.aspect = Env.width / Env.height;
    camera.updateProjectionMatrix();
    renderer.setSize(Env.width, Env.height);
  }

  update () {
    const {renderer, camera, controls, world} = this;
    world.update(renderer, camera, controls);
    controls.mouse.update();
    controls.keys.update();
  }

}

module.exports = Game;
