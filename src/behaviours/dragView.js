/* @flow */
const {THREE} = require('three');
const {Vector3} = THREE;
const Mouse = require('../controls/MouseControls');

function dragView (mouse:Mouse, entityRot:Vector3, cameraRot:Vector3) {
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
