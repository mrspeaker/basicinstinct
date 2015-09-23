const {THREE} = require('three');
const items = require('../items/');
const UUID = require('../items/UUID');
const Env = require('../Env');

class Room {

  constructor (DATA, viewer) {
    // This is to pass events down to interested items.
    // Might be better to move this out to a more global system
    // like in Env.
    this.events = {
      keydown: [],
      keyup: []
    };

    this.scene = new THREE.Scene();

    this.items = [];
    (DATA.items || []).map(i => this.addItem(i));
    this.addLights();

    this.viewer = viewer;
    this.bindEvents();
  }

  setViewer (viewer) {
    this.viewer = viewer;
    this.viewer.setSelected(null);
    this.viewer.doSyncCam = true;
  }

  addItem (i) {
    const item = items[i.type];
    if (!item) {
      console.log('unknown item:', i.type);
      return null;
    }

    const args = i.args || {};
    const itemInst = new item(args);
    itemInst.mesh.userData.inst = itemInst;
    itemInst.id = i.id !== undefined ? i.id : UUID();
    itemInst.defn = Object.assign({}, i);

    i.pos && itemInst.mesh.position.set(...i.pos);
    i.rot && itemInst.mesh.rotation.set(...i.rot);
    i.scale && itemInst.mesh.scale.set(...i.scale);

    (i.events || []).forEach(name => {
      if (!this.events[name]) {
        console.error('no event called ', name);
      } else {
        this.events[name].push(itemInst);
      }
    });

    console.log("im ons:", i.ons);
    if (i.ons) {
      itemInst.ons = i.ons;
    }

    // Add to scene and items
    this.scene.add(itemInst.mesh);
    this.items.push(itemInst);

    return itemInst;
  }

  removeItem (item) {
    if (typeof item === 'number') {
      // Handle removing by id.
    }

    this.scene.remove(item.mesh);
    this.items = this.items.filter(i => i !== item);
  }

  getItem (id) {
    return this.items.find(i => i.id === id);
  }

  bindEvents () {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    // Eh, delegating ALL world events is not good.
    Env.events.on('WorldCreated', () => {
      this.items.forEach(i => i.fireItem('WorldCreated'));
    });

    Env.events.on('action', a => {
      // Don't fire room events in Editor mode.
      if (this.viewer.type !== "Player") {
        return;
      }
      const {name, to, from} = a;
      var item;
      if (to === 'room') {
        // room event.
          console.log(name)
        switch (name) {
        case 'itemSelected':
          console.log('oh, in action selected')
          break;
        case 'toggle':
          item = this.getItem(a.item);
          item.mesh.visible = !item.mesh.visible;
          break;
        case 'removeItem':
          item = this.getItem(a.item);
          this.removeItem(item);
          break;
        case 'addItem':
          if (a.relativeTo) {
            const item = this.getItem(a.relativeTo);
            if (item) {
              a.defn.pos[0] += item.mesh.position.x;
              a.defn.pos[1] += item.mesh.position.y;
              a.defn.pos[2] += item.mesh.position.z;
            }
          }
          console.log("adding from additem", a.defn);
          this.addItem(a.defn);
          break;
        default:
          console.log('unknown room event', name);
        }
        return;
      }

      item = this.getItem(to);
      if (item) {
        item.fireItem(name, {from});
      } else {
        console.log('item not found.');
      }
    });

  }

  onKeyDown (e) {
    this.events.keydown.forEach(i => i.on('keydown', e));
  }
  onKeyUp (e) {
    this.events.keyup.forEach(i => i.on('keyup', e));
  }

  addLights () {
    const {scene} = this;
    const ambLight = new THREE.AmbientLight(0x909090);
    scene.add(ambLight);

    //var hemLight = new THREE.HemisphereLight(0xffe5bb, 0xFFBF00, .1);
    //scene.add(hemLight)

    /*
    const point = new THREE.PointLight(0xFCEAD5, 2.5, 7.5);
    point.position.set(1, 2.5, 3);
    scene.add(point);
    scene.add(new THREE.PointLightHelper(point, 0.1));
    */
  }

  update (renderer, camera, controls) {
    this.viewer.update(renderer, camera, this, controls);
    this.items.forEach(i => i.update());
    renderer.render(this.scene, camera);
  }

  onLeave () {}

  getDefn (inst) {
    const {id, defn} = inst;
    const {type, args, events} = defn;
    const roundy = a => {
      const r = num => Math.floor(num * 10000) / 10000;
      return [r(a.x), r(a.y), r(a.z)];
    };
    const {position:pos, rotation:rot, scale} = inst.mesh;
    const rscale = roundy(scale);
    const rrot = roundy(rot);
    const out = {
      id,
      type,
      args,
      events,
      pos: roundy(pos),
      rot: rrot
    };

    if (Object.keys(inst.ons).length) {
      out.ons = inst.ons;
    }

    // Don't include scale if 1
    if (rscale[0] !== 1 || rscale[1] !== 1 || rscale[2] !== 1) {
      // no 0 scales.
      out.scale = rscale.map(i => i === 0 ? 0.01 : i);
    }

    return out;
  }

  dump () {
    console.log("saved to window._dump: copy(_dump); for clipboard.");
    window._dump = this.items.map(i => this.getDefn(i));
  }

}

module.exports = Room;
