const Sensor = require('./Sensor');
const Env = require('../../Env');

class Collision extends Sensor {


  // Todo: handle id, ids, types...
  constructor (id) {
    super();

    Env.events.on('collision', ({b}) => {
      if (b.id === id) {
        this.fire();
      }
    });
  }

}

module.exports = Collision;
