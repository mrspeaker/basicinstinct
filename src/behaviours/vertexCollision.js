const {THREE} = require('three');

const ray = new THREE.Raycaster();
const direction = new THREE.Vector3();

function getHits (mesh, children) {

  return mesh.geometry.vertices.map(v => {
    const vertex = v.clone();
    vertex.applyMatrix4(mesh.matrixWorld); // Convert to global
    direction.subVectors(vertex, mesh.position);
    ray.set(mesh.position, direction.clone().normalize());
    const hit = (ray.intersectObjects(children, true))[0] || null;
    if (hit) {
      const dist = hit.distance - direction.length();
      if (dist < 0) {
        return dist;
      }
    }
    return false;
  });
}

module.exports = getHits;
