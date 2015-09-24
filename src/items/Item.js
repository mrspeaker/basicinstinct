const Env = require('../Env');

class Item {

  constructor () {
    this.ons = {};
    this.worldsOns = {};
  }

  fire (name, data) {}

  fireItem (name, data) {
    this.fire(name, data);
    const toEmit = this.ons[name] || [];
    toEmit.forEach(msg => Env.events.emit('action', {...msg, from:this.id}));
  }

  update () {}

}

module.exports = Item;
