const Sensor = require('./Sensor');
const Env = require('../../Env');

class Collision extends Sensor {

  constructor (types) {
    super();

    Env.events.on('collision', ({a, b}) => {
      console.log(a, b)
      if (types.indexOf(b.type) > -1) {
        console.log('fire!')
        this.fire();
      }
    });
  }

  update () {

  }

}

module.exports = Collision;
