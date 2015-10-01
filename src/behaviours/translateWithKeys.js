function translateWithKeys (mesh, keys, speed=0.05) {
  const {left, right, forward, backward, up, down} = keys.move;
  if (left || right || forward || backward || up || down) {
    if (left) mesh.translateX(-speed);
    if (right) mesh.translateX(speed);
    if (forward) mesh.translateZ(-speed);
    if (backward) mesh.translateZ(speed);
    if (up) mesh.translateY(-speed);
    if (down) mesh.translateY(speed);
    return true;
  }
  return false;
}

module.exports = translateWithKeys;
