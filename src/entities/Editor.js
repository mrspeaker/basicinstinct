/* @flow*/
const {THREE} = require('three');
const Viewer = require('./Viewer');
const Env = require('../Env');
const Items = require('../items/');
const translateWithKeys = require('../behaviours/translateWithKeys');
const moveWithKeys = require('../behaviours/moveWithKeys');
const dragView = require('../behaviours/dragView');
const raycaster = require('../behaviours/raycaster');

const Keys = require('../controls/KeyControls');
const Controls = require('../controls/');
const Room = require('../world/Room');


class Editor extends Viewer {

  mode: string;
  invisible: boolean;
  ui: HTMLElement;
  clickAdd: Function;

  constructor () {
    super();
    this.mode = "position";

    this.type = "Editor";
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00dd00, wireframe:true});

    this.mesh = new THREE.Mesh(geometry, material);
    this.invisible = true;
    this.mesh.visible = !this.invisible;

    this.ui = document.querySelector("#edui");
    this.clickAdd = this.clickAdd.bind(this);
    Object.keys(Items).map(k => {
      const but = document.createElement('button');
      but.setAttribute('data-name', k);
      but.textContent = k;
      but.addEventListener('click', this.clickAdd, false);
      return but;
    }).map(b => this.ui.appendChild(b));
  }

  clickAdd (e:Event) {
    if (e.target instanceof HTMLInputElement) {
      const type = e.target.getAttribute('data-name');
      Env.events.emit('addNewItem', type);
    }
  }

  toggleUI (isOn:boolean) {
    const dom = document.querySelector('#edui');
    if (!dom) { return; }
    dom.style.display = isOn ? 'block' : 'none';
  }

  handleKeys (keys:Keys, room:Room) {
    const {selected} = this;

    if (selected) {
      keys.pressed.forEach(k => {
        switch (k.which) {
        case 27: /*esc*/
          this.setSelected(null);
          break;
        case 90:
          // Duplicate selected object
          if (selected) {
            const origDefn = room.getDefn(selected);
            delete origDefn.id;
            this.setSelected(room.addItem(origDefn));
            selected.mesh.position.y += 0.2;
          }
          break;
        case 88:
          // Remove selected.
          if (selected) {
            room.removeItem(selected);
            this.setSelected(null);
          }
          break;
        case 49: this.mode = "position"; break;
        case 50: this.mode = "scale"; break;
        case 51: this.mode = "rotation"; break;
        }
      });
    }
  }

  update (camera: THREE.PerspectiveCamera, room:Room, {mouse, keys}:Controls) {
    const {left, right, forward, backward, up, down} = keys.move;
    const {mode, selected, mesh, rotation} = this;
    const isViewer = !this.selected;

    if (left || right || forward || backward || up || down) {
      const obj = isViewer ? mesh : selected ? selected.mesh : null;
      if (obj) {
        var amount = mode === "rotation" ? Math.PI / 20 : 0.05;
        // Move camera fast by default, slow with shift
        if (isViewer) {
          amount *= keys.move.shift ? 0.08: 1;
        } else {
          amount *= keys.move.shift ? 1: 0.05;
        }

        if (mode === "position") {
          translateWithKeys(obj, keys, amount);
        } else {
          moveWithKeys(obj[mode], keys, amount);
        }

        if (mode === "scale") {
          // No 0 size!
          obj.scale.x = Math.max(0.01, obj.scale.x);
          obj.scale.y = Math.max(0.01, obj.scale.y);
          obj.scale.z = Math.max(0.01, obj.scale.z);
        }
      }

      if (!isViewer) { Env.events.emit('selectionChange', this.selected); }

    }

    // Check under mouse
    const hits = raycaster(room.scene.children, mouse.pos, camera);
    this.hovering = hits[0] ? hits[0].object : null;
    if (mouse.right.clicked) {
      this.setSelected(this.hovering);
    }

    dragView(mouse, rotation, camera.rotation);
    this.handleKeys(keys, room);

    this.syncCamera(camera);

  }
}

module.exports = Editor;
