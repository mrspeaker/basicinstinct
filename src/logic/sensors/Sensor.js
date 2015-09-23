class Sensor {

  constructor () {
    this.listeners = [];
  }

  add (cb) {
    this.listeners.push(cb);
  }

  remove (cb) {
    this.listeners = this.listeners.filter(c => c !== cb);
  }

  fire (data) {
    this.listeners.forEach(cb => cb(data));
  }

}

module.exports = Sensor;
