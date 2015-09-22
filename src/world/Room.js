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
    itemInst.id = UUID();
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

    // Add to scene and items
    this.scene.add(itemInst.mesh);
    this.items.push(itemInst);

    return itemInst;
  }

  bindEvents () {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    Env.events.on('itemSelected', s => {
      if (s && s.type === 'Switch') {
        s.switchIt();
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

    const point = new THREE.PointLight(0xFCEAD5, 2.5, 7.5);
    point.position.set(1, 2.5, 3);
    scene.add(point);
    scene.add(new THREE.PointLightHelper(point, 0.1));
  }

  update (renderer, camera, controls) {
    this.viewer.update(renderer, camera, this, controls);
    this.items.forEach(i => i.update());
    renderer.render(this.scene, camera);
  }

  onLeave () {}

  getDefn (inst) {
    const {type, args, events} = inst.defn;
    const roundy = a => {
      const r = num => Math.floor(num * 10000)/10000;
      return [r(a.x), r(a.y), r(a.z)];
    };
    const {position:pos, rotation:rot, scale} = inst.mesh;
    const rscale = roundy(scale);
    const rrot = roundy(rot);
    const out = {
      type,
      args,
      events,
      pos: roundy(pos),
      rot: rrot
    };

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
