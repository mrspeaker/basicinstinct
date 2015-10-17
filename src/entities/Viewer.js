/* @flow */
const Env = require('../Env');
const Transformable = require('../behaviours/Transformable');

const {THREE} = require('three');
const Item = require('../items/Item');
const Keys = require('../controls/KeyControls');
const Room = require('../world/Room');
const Controls = require('../controls/');


class Viewer {

  type: string;
  hovering: ?Item;
  selected: ?Item;
  position: Object;
  rotation: Object;
  scale: Object;
  mesh: THREE.Object3D;

  constructor () {
    this.hovering = null;
    this.selected = null;
  }

  syncCamera (camera: THREE.PerspectiveCamera) {
    const {position:pos} = this;
    camera.position.set(pos.x, pos.y + 0.8, pos.z);
  }

  setSelected (selected: ?Item) {
    if (this.selected != null && this.selected !== selected) {
      this.selected.isSelected = false;
      this.selected.fireItem('itemDeselected');
      Env.events.emit('itemDeselected', this.selected);
    }
    this.selected = selected;
    if (this.selected != null && this.selected.mesh.visible) {
      this.selected.isSelected = true;
      this.selected.fireItem('itemSelected');
    }
    Env.events.emit('itemSelected', this.selected);
  }

  update (camera: THREE.PerspectiveCamera, room:Room, {mouse, keys}:Controls) {}

}

module.exports = Viewer;//Transformable(Viewer);
