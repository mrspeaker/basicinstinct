const Sensor = require('./Sensor');

class Random extends Sensor {

  constructor (oneIn = 20, delay = 0) {
    super();
    this.oneIn = oneIn;
    this.delay = delay;
    this.ticks = 0;
  }

  update () {
    if (this.ticks++ < this.delay) {
      return;
    }

    const val = Math.random() * this.oneIn | 0;
    if (val === 1) {
      this.fire();
    }
  }

}

module.exports = Random;
