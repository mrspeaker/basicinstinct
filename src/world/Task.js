const Env = require('../Env');

class Task {
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
    Env.events.emit('task-started', this.name);
    console.log('task started:', this.name);
    this.listen.call(this, this.unlock, this.state);
  }
  unlock () {
    console.log('Task get:', this.name);
    this.locked = false;
    this.unlisten();
    Env.events.emit('task-unlocked', this.name);
    this.success();
  }
}

module.exports = Task;
