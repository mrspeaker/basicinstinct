const Sensor = require('./Sensor');

class Always extends Sensor {

  constructor (every = 1) {
    super();
    this.every = every;
    this.ticks = 0;
  }

  update () {
    this.ticks++;
    if (this.ticks % this.every === 0) {
      this.fire(this.ticks);
    }
  }

}

module.exports = Always;
