/* @flow */
const {EventEmitter} = require('events');
const WorldEvents = new EventEmitter();

const Env: {
  dom: Object,
  height: number,
  width: number,
  events: EventEmitter,
  serialBus: Object
} = {
  dom: document.body, // Overwrite me!
  height: 0,
  width: 0,
  events: WorldEvents,
  serialBus: {}
};

module.exports = Env;
