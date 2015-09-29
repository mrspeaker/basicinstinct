const Env = require('../Env');

class Achievement {
  constructor (name, listen, unlisten, success) {
    this.name = name;
    this.listen = listen;
    this.unlisten = unlisten;
    this.success = success;

    this.locked = true;
    this.state = {};
    this.unlock = this.unlock.bind(this);
  }
  start () {
    Env.events.emit('achievement-started', this.name);
    console.log('achievement started:', this.name);
    this.listen.call(this, this.unlock, this.state);
  }
  unlock () {
    console.log('Ach get:', this.name);
    this.locked = false;
    this.unlisten();
    Env.events.emit('achievement-unlocked', this.name);
    this.success();
  }
}

module.exports = Achievement;
