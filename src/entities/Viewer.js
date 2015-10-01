const Env = require('../Env');
const Raycastable = require('../behaviours/Raycastable');
const Transformable = require('../behaviours/Transformable');

class Viewer {

  constructor () {
    this.hovering = null;
    this.selected = null;
    this.doSyncCam = false;
  }

  syncCam (camera) {
    camera.position.x = this.position.x;
    camera.position.z = this.position.z;
    camera.position.y = this.position.y + 0.8;
    this.doSyncCam = false;
  }

  setSelected (selected) {
    if (this.selected && this.selected !== selected) {
      this.selected.isSelected = false;

      Env.events.emit('itemDeselected', this.selected);
      this.selected.fireItem('itemDeselected');
    }
    this.selected = selected || null;
    if (this.selected && this.selected.mesh.visible) {
      this.selected.isSelected = true;
      this.selected.fireItem('itemSelected');
    }
    Env.events.emit('itemSelected', this.selected);
  }

}

module.exports = Transformable(Raycastable(Viewer));
