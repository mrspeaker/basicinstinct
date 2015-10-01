const Env = require('../Env');
const Raycastable = require('../behaviours/Raycastable');
const Transformable = require('../behaviours/Transformable');

class Viewer {

  constructor () {
    this.hovering = null;
    this.selected = null;
  }

  syncCamera (camera) {
    const {position:pos} = this;
    camera.position.set(pos.x, pos.y + 0.8, pos.z);
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
