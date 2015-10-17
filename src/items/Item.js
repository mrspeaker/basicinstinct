/* @flow */
const Env = require('../Env');
const {THREE} = require('three');

class Item {

  ons: Object;
  worldsOns: Object;
  id:number;
  mesh: THREE.Mesh;
  isSelected: boolean;
  type: string;

  constructor () {
    this.ons = {};
    this.worldsOns = {};
  }

  fire (name: string, data: ?Object) {}

  fireItem (name: string, data: ?Object) {
    this.fire(name, data);
    const toEmit = this.ons[name] || [];
    toEmit.forEach(msg => Env.events.emit('action', {...msg, from:this.id}));
  }

  update () {}

}

module.exports = Item;
