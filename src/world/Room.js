const {THREE} = require('three');
const items = require('../items/');
const UUID = require('../items/UUID');
const Env = require('../Env');

const {Always, Random, Click, Collision} = require('../logic/sensors/');
const {And, Or, Count} = require('../logic/combiners/');

class Room {

  constructor (DATA, viewer, onLeave) {
    // This is to pass events down to interested items.
    // Might be better to move this out to a more global system
    // like in Env.
    this.events = {
      keydown: [],
      keyup: []
    };

    this.scene = new THREE.Scene();
    this.name = DATA.name;

    this.items = [];
    (DATA.items || []).map(i => this.addItem(i));
    this.addGlobalLights();

    this.viewer = viewer;
    this.bindEvents();

    this.isColliding = new Set();

    // === testing sensors ===
    this.sensors = [];
    this.combiners = [];

    const toggleItem = (id) => {
      Env.events.emit('action', {
        "name": "toggle",
        "to": "room",
        "item": id
      });
    };

    if (this.name === 'bedroom') {

      const s1 = new Always(3);
      const s2 = new Always(100);
      const clicker = new Click(13);
      const rando = new Random(300);
      const trig = new Collision(17);
      this.sensors.push(s1, s2, clicker, rando);

      const toggleLight = () => {
        Env.events.emit('action', {
          "name": "toggleLight",
          "to": 16
        });
      };

      trig.add(t => {
        onLeave(this.name, t.onTrigger);
      });

      const c1 = new And(s1, s2);
      const c2 = new Count(clicker, 5, true);
      const c3 = new Or(c1, c2);
      this.combiners.push(c1, c2, c3);

      //c3.add(() => toggleItem(20));
    }

    // =========================

    if (this.name === 'bedroom2') {
      const trig = new Collision(3); // Trig should do this automagically.
      trig.add((t) => onLeave(this.name, t.onTrigger));
    }

    if (this.name === 'hall') {
      const trig = new Collision(2); // Trig should do this automagically.
      trig.add((t) => onLeave(this.name, t.onTrigger));
    }
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
    itemInst.name = i.name;
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
        switch (name) {
        case 'itemSelected':
          // THIS is if sent to room!
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
              const defn = Object.assign({}, a.defn);
              if (a.randomYo) {
                defn.pos[0] = item.mesh.position.x + (Math.random() * 4 - 2);
                defn.pos[1] = item.mesh.position.y + (Math.random() * 4 - 2);
                defn.pos[2] = item.mesh.position.z + (Math.random() * 4 - 2);
              } else {
                defn.pos[0] += item.mesh.position.x;
                defn.pos[1] += item.mesh.position.y;
                defn.pos[2] += item.mesh.position.z;
              }
            }
          }
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
        console.log('item not found.', to);
      }
    });

  }

  onKeyDown (e) {
    this.events.keydown.forEach(i => i.on('keydown', e));
  }
  onKeyUp (e) {
    this.events.keyup.forEach(i => i.on('keyup', e));
  }

  addGlobalLights () {
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

    const newCollisions = new Set();
    const wasColliding = new Set();

    this.items.forEach(i => {
      i.update();
      if (i.collidable) {
        const dist = camera.position.distanceToSquared(i.mesh.position);
        const already = this.isColliding.has(i);
        if (dist < 1.0) {
          if (!already) {
            newCollisions.add(i);
            this.isColliding.add(i);
          }
        } else {
          if (already) {
            this.isColliding.delete(i);
            wasColliding.add(i);
          }
        }
      }
    });

    newCollisions.forEach(i => {
      Env.events.emit('collision', {
        a: this.viewer,
        b: i
      });
    });

    wasColliding.forEach(i => {
      Env.events.emit('collisionEnded', {
        a: this.viewer,
        b: i
      });
    });

    this.sensors.forEach(s => s.update());
    this.combiners.forEach(c => c.update());

    renderer.render(this.scene, camera);
  }

  onEnter () {}
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
      name,
      args,
      events,
      pos: roundy(pos)
    };

    if (Object.keys(inst.ons).length) {
      out.ons = inst.ons;
    }

    // Don't include scale if 1
    if (rscale[0] !== 1 || rscale[1] !== 1 || rscale[2] !== 1) {
      // no 0 scales.
      out.scale = rscale.map(i => i === 0 ? 0.01 : i);
    }
    if (rrot[0] !== 0 || rrot[1] !== 1 || rrot[2] !== 1) {
      out.rot = rrot;
    }

    return out;
  }

  dump () {
    console.log("saved to window._dump: copy(_dump); for clipboard.");
    window._dump = this.items.map(i => this.getDefn(i));
  }

}

module.exports = Room;
