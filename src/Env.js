const DomEvents = new (require('events').EventEmitter)();
const WorldEvents = new (require('events').EventEmitter)();

module.exports = {
  dom: document.body, // Overwrite me!
  domEvents: DomEvents,
  events: WorldEvents
};
