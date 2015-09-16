const {THREE} = require('three');
const Computer = require('./Computer');

const computer = new Computer();
const compy = new Computer();

var scene, camera, renderer;

init();
animate();

function init() {

  document.body.addEventListener('keydown', e => computer.computer.keys.down(e), false);
  document.body.addEventListener('keyup', e => computer.computer.keys.up(e), false);



  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 2;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

  scene.add( computer.mesh );
  scene.add( compy.mesh );

  compy.mesh.position.set(0.0, 2.0, -7.0);
  computer.mesh.position.set(0.0, -0.4, -1.0);
  computer.mesh.rotation.y = Math.PI/8;
  compy.mesh.rotation.y = -Math.PI/5;
  compy.mesh.rotation.x = 0.2;
  addLights();

}

function addLights() {
  const ambLight = new THREE.AmbientLight(0xFFf7d1);
  scene.add(ambLight);

  // var dirLight = new THREE.DirectionalLight(0xffffff, 1);
  // dirLight.position.set(100, 100, 50);
  // scene.add(dirLight);

  //var hemLight = new THREE.HemisphereLight(0xffe5bb, 0xFFBF00, .1);
//scene.add(hemLight)

  var bluePoint = new THREE.PointLight(0xFEFFDE, 3, 10);
bluePoint.position.set( 3, 3, 1 );
scene.add(bluePoint);
scene.add(new THREE.PointLightHelper(bluePoint, 3));

}


function animate() {
  requestAnimationFrame( animate );

  computer.update();
  compy.update();

  renderer.render( scene, camera );
}
