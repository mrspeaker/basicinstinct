/* @flow */
const WorldEvents = new (require('events').EventEmitter)();

const Env:{
  dom: Object,
  height: number,
  width: number,
  events: Object,
  serialBus: Object
} = {
  dom: document.body, // Overwrite me!
  height: 0,
  width: 0,
  events: Object,
  serialBus: {}
};

module.exports = Env;
