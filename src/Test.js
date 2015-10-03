const {THREE} = require('three');
const Controls = require('./controls/');

function getHits (mesh, children) {
  const ray = new THREE.Raycaster();
  //return mesh.geometry.vertices.map(v => {
  const v = mesh.geometry.vertices[2];
  const vertex = v.clone();
  vertex.applyMatrix4(mesh.matrixWorld); // Convert to global
  var direction = new THREE.Vector3();
  direction.subVectors(vertex, mesh.position);
  ray.set(mesh.position, direction.clone().normalize());
  const hitss = ray.intersectObjects(children, true).filter(i => i.object !== mesh);
  const hit = hitss[0] || null;
  if (hit) {
    const dist = hit.distance - direction.length();
    console.log("ddd:",hit.distance, direction.length(), dist)
    if (dist < 0) {
      return dist;
    }
  }
  return false;
  //});

  /*
  const direction = new THREE.Vector3(0, -0.5, 0);
  ray.set(mesh.position, direction.clone().normalize());
  const hitss = ray.intersectObjects(children, true);
  const hit = hitss[0] || null;
  if (hit) {
    console.log(hit.distance, direction.length());
    const dist = hit.distance - direction.length();
    if (dist < 0) {
      return dist;
    }
  }
  return false;*/
}

class Box {
  constructor (sx=1, sy=1, sz=1) {
    const geometry = new THREE.BoxGeometry(sz, sy, sz);
    const material = new THREE.MeshPhongMaterial({ color: 0x85ff33 });
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;
  }
}

class Game {

  constructor () {
    this.controls = Controls();

    // Add renderer and camera
    this.w = 640;
    this.h = 380;
    const renderer = this.renderer = new THREE.WebGLRenderer({antialias:true});
    const camera = this.camera = new THREE.PerspectiveCamera(65, this.w/this.h, 0.1, 300);
    camera.position.set(0, 0.5, 0);
    camera.updateProjectionMatrix();
    renderer.setSize(this.w, this.h);
    document.body.appendChild(this.renderer.domElement);

    const scene = this.scene = new THREE.Scene();
    const ambLight = new THREE.AmbientLight(0x505050);
    scene.add(ambLight);

    this.one = new Box(1, 1, 1);
    this.one.mesh.position.set(0, 1, -5);
    this.scene.add(this.one.mesh);

    this.two = new Box(5, 0.1, 5);
    this.two.mesh.position.set(0, 0, -5);
    this.scene.add(this.two.mesh);

    this.scene.updateMatrixWorld();

  }

  update () {
    const {renderer, camera, controls} = this;

    const mesh = this.one.mesh;
    const v = mesh.geometry.vertices[2];
    console.log("vvv", v);

    if (controls.keys.move.down) {
      mesh.position.y -= 0.01;
    }
    if (controls.keys.move.up) {
      mesh.position.y += 0.01;
    }

    //this.scene.updateMatrixWorld();
    mesh.updateMatrixWorld();
    const h = getHits(mesh, this.scene.children);
    if (h) {
      console.log("HIT!", h[2], mesh.position.y);
      mesh.position.y = this._lastNotHit;

    } else {
      console.log("not hit", mesh.position.y);
      this._lastNotHit = mesh.position.y;
    }
      //this.scene.updateMatrixWorld()
    renderer.render(this.scene, camera);
    controls.keys.update();
  }

}

module.exports = Game;
