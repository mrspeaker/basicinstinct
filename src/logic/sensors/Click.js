const Sensor = require('./Sensor');
const Env = require('../../Env');

class Click extends Sensor {

  constructor (id) {
    super();

    Env.events.on('itemSelected', (i) => {
      if (i && i.id === id) {
        this.fire();
      }
    });
  }

}

module.exports = Click;
