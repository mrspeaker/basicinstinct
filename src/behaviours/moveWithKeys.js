function moveWithKeys (prop, keys, amount=0.05) {
  const {left, right, forward, backward, up, down} = keys.move;
  if (left) { prop.x -= amount; }
  if (right) { prop.x += amount; }
  if (forward) { prop.z -= amount; }
  if (backward) { prop.z += amount; }
  if (up) { prop.y -= amount; }
  if (down) { prop.y += amount;}
}

module.exports = moveWithKeys;
