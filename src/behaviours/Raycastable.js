const {THREE} = require('three');

function Raycastable(c) {
  const raycaster = new THREE.Raycaster();

  const getHits = children => {
    return raycaster
      .intersectObjects(children, true)
      .map(({object}) => {
        return object.userData.inst || object.parent.userData.inst;
      })
      .filter(i => !!i);
  };

  c.prototype.raycast = function (children, origin, direction) {
    if (origin) {
      if (direction.type === "PerspectiveCamera") {
        raycaster.setFromCamera(origin, direction);
      } else {
        raycaster.set(origin, direction);
      }
    }
    return getHits(children);
  };
  return c;
}

module.exports = Raycastable;
