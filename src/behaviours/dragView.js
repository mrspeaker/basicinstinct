function dragView (mouse, entityRot, cameraRot) {
  if (mouse.left.dragging) {
    const {dx, dy} = mouse.pos;
    const dragSpeed = -1.3;
    if (dx) {
      // TODO: figure out better way to sync...
      cameraRot.y += dx * dragSpeed;
      entityRot.y = cameraRot.y;
    }
    if (dy) {
      var rotx = cameraRot.x;
      rotx -= dy * dragSpeed;
      cameraRot.x = Math.min(0.7, Math.max(-0.7, rotx));
    }
  }
}

module.exports = dragView;
