const {THREE} = require('three');
const {Computer, CRT} = require('ITSBasic');

const computer = new Computer();
const screen = CRT(computer);
const screenTexture = new THREE.Texture(screen);

document.body.addEventListener('keydown', e => computer.keys.down(e), false);
document.body.addEventListener('keyup', e => computer.keys.up(e), false);

var scene, camera, renderer, mesh;

init();
animate();

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 2;

  const geometry = new THREE.BoxGeometry( 1.6, 1, 1 );
  const material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

  var screenMaterial = new THREE.MeshBasicMaterial({
    map : screenTexture,
    side: THREE.DoubleSide
  });
  screenMaterial.map.minFilter = THREE.NearestFilter;
  const screenMesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(screen.width, screen.height),
    screenMaterial);
  screenMesh.scale.set(0.005  , 0.005, 1);
  screenMesh.position.x = 0;
  screenMesh.position.y = 0;
  screenMesh.position.z = 0.501;
  mesh.add(screenMesh);
}

function animate() {
  requestAnimationFrame( animate );

  mesh.rotation.y = Math.sin(Date.now() / 3000) * 0.7;

  renderer.render( scene, camera );
  screenTexture.needsUpdate = true;
}
