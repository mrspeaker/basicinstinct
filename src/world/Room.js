/* @flow */
const {THREE} = require('three');
const items = require('../items/');
const UUID = require('../items/UUID');
const Env = require('../Env');
const Cursor = require('./Cursor');

const {Always, Random, Click, Collision} = require('../logic/sensors/');
const {And, Or, Count} = require('../logic/combiners/');

const Viewer = require('../entities/Viewer');
const Controls = require('../controls/');
const Item = require('../items/Item');

class Room {

  events: Object;
  scene: THREE.Scene;
  name: string;
  items: Array<Item>;
  cursor: Cursor;
  entities: Array<any>;
  isColliding: Object; // should be Set
  sensors: Array<any>;
  combiners: Array<any>;
  viewer: Viewer;

  onKeyUp: Function;
  onKeyDown: Function;

  constructor (DATA:Object, viewer:Viewer, onLeave:any) {
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

    this.cursor = new Cursor();
    this.scene.add(this.cursor.mesh);

    this.entities = [];

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

    if (this.name === 'purgatory') {
      const trig = new Collision(3); // Trig should do this automagically.
      trig.add((t) => onLeave(this.name, t.onTrigger));
    }

    if (this.name === 'hall') {
      const trig = new Collision(2); // Trig should do this automagically.
      trig.add((t) => onLeave(this.name, t.onTrigger));
    }
  }

  addEntity (entity: Viewer) {
    this.entities.push(entity);
    this.scene.add(entity.mesh);
  }

  setViewer (viewer: Viewer) {
    this.viewer = viewer;
    this.viewer.setSelected(null);
  }

  addItem (defn: Object): Item {
    const item = items[defn.type];
    if (!item) {
      throw new Error('unknown item:', defn.type);
    }

    const args = defn.args || {};
    console.log(defn.args);
    const itemInst = new item(args);
    itemInst.mesh.userData.inst = itemInst;
    // TODO: ids are messed up. try again.
    const id = UUID.id;
    itemInst.id = defn.id !== undefined ? defn.id : id;
    itemInst.name = defn.name;
    itemInst.defn = Object.assign({}, defn);

    defn.pos && itemInst.mesh.position.set(...defn.pos);
    defn.rot && itemInst.mesh.rotation.set(...defn.rot);
    defn.scale && itemInst.mesh.scale.set(...defn.scale);

    (defn.events || []).forEach(name => {
      if (!this.events[name]) {
        console.error('no event called ', name);
      } else {
        this.events[name].push(itemInst);
      }
    });

    if (defn.ons) {
      itemInst.ons = defn.ons;
    }

    // Add to scene and items
    this.scene.add(itemInst.mesh);
    this.items.push(itemInst);

    return itemInst;
  }

  removeItem (item:Object): Item {
    if (typeof item === 'number') {
      // Handle removing by id.
    }

    this.scene.remove(item.mesh);
    this.items = this.items.filter(i => i !== item);
    return item;
  }

  getItem (id:Number): Item {
    return this.items.find(i => i.id === id);
  }

  bindEvents () {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    // Eh, delegating ALL world events is not good.
    Env.events.on('WorldCreated', () => {
      this.items.forEach(i => i.fireItem('WorldCreated'));
    });

    Env.events.on('itemSelected', (i) => {
      this.cursor.wrapItem(i);
    });

    Env.events.on('itemClearSelect', () => {
      this.viewer.setSelected(null);
    });

    Env.events.on('addNewItem', (type) => {
      const item = items[type];
      const defn = Object.assign({}, item.defn);
      const pos = this.viewer.mesh.position;
      defn.type = type;
      defn.pos = [pos.x, pos.y, pos.z];
      console.log(defn);
      this.addItem(defn);
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
        case 'showListing':
          if (this.viewer.showListing) {
            this.viewer.showListing(a.text);
          };
          break;
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

  onKeyDown (e:Object) {
    this.events.keydown.forEach(i => i.on('keydown', e));
  }
  onKeyUp (e:Object) {
    this.events.keyup.forEach(i => i.on('keyup', e));
  }

  addGlobalLights () {
    const {scene} = this;

    scene.fog = new THREE.Fog(0x050500, 8, 15);

    const ambLight = new THREE.AmbientLight(0x404040);
    scene.add(ambLight);

    //var hemLight = new THREE.HemisphereLight(0xffe5bb, 0xFFBF00, 1);
    //scene.add(hemLight)

    /*
    const point = new THREE.PointLight(0xFCEAD5, 2.5, 7.5);
    point.position.set(1, 2.5, 3);
    scene.add(point);
    scene.add(new THREE.PointLightHelper(point, 0.1));
    */
  }

  update (renderer:THREE.WebGLRenderer, camera:THREE.PerspectiveCamera, controls:Controls | void) {

    if (controls) {

      this.viewer.update(camera, this, controls);

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

    }

    this.sensors.forEach(s => s.update());
    this.combiners.forEach(c => c.update());

    renderer.render(this.scene, camera);
  }

  onEnter () {}
  onLeave () {}

  getDefn (inst: Object): Object {
    const {id, defn} = inst;
    const {type, args, events} = defn;
    const roundy = a => {
      const r = num => Math.floor(num * 10000) / 10000;
      return [r(a.x), r(a.y), r(a.z)];
    };
    const {position:pos, rotation:rot, scale} = inst.mesh;
    const rscale = roundy(scale);
    const rrot = roundy(rot);

    const name = inst.name || "unknown";

    const out = {
      id,
      type,
      name,
      args,
      events,
      pos: roundy(pos),
      ons: null,
      scale: null,
      rot: null
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

}

module.exports = Room;
