const DomEvents = new (require('events').EventEmitter)();

module.exports = {
  dom: document.body, // Overwrite me!
  events: DomEvents
};
