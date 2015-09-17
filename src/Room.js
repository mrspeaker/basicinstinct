const {THREE} = require('three');
const items = require('./items/');
const UUID = require('./items/UUID');

class Room {

  constructor (DATA) {

    this.events = {
      keydown: [],
      keyup: []
    };

    this.scene = new THREE.Scene();

    this.items = (DATA.items || []).map(i => {
      const item = items[i.type];
      if (items[i.type]) {
        const args = i.args || {};
        const itemInst = new item(args);
        itemInst.mesh.userData.inst = itemInst;
        itemInst.id = UUID();

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
        return itemInst;
      } else {
        console.log('unknown item:', i.type);
      }
    });

    this.items.forEach(i => this.scene.add(i.mesh));

    this.bindEvents();
    this.addLights();

  }

  bindEvents () {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  onKeyDown (e) {
    this.events.keydown.forEach(i => i.on('keydown', e));
  }
  onKeyUp (e) {
    this.events.keyup.forEach(i => i.on('keyup', e));
  }

  addLights () {
    const {scene} = this;
    const ambLight = new THREE.AmbientLight(0xFFf7f1);
    scene.add(ambLight);

    //var hemLight = new THREE.HemisphereLight(0xffe5bb, 0xFFBF00, .1);
    //scene.add(hemLight)

    var point = new THREE.PointLight(0xFEFFDE, 3, 7);
    point.position.set( 1, 3, 3 );
    scene.add(point);
    scene.add(new THREE.PointLightHelper(point, 1));
  }

  update (renderer, camera) {
    this.items.forEach(i => i.update());
    renderer.render(this.scene, camera);
  }

  onLeave () {
    document.body.removeEventListener('keydown', this.onKeyDown);
    document.body.removeEventListener('keyup', this.onKeyUp);
  }

}

module.exports = Room;
