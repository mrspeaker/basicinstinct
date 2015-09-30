const WorldEvents = new (require('events').EventEmitter)();

module.exports = {
  dom: document.body, // Overwrite me!
  height: 0,
  width: 0,
  events: WorldEvents,
  serialBus: null
};
