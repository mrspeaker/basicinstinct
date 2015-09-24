class Combiner {

  constructor (inputs) {
    // assert input length!
    this.inputs = inputs;
    this.outputs = [];
  }

  add (cb) {
    this.outputs.push(cb);
  }

  remove (cb) {
    this.outputs = this.outpus.filter(c => c !== cb);
  }

  fire (data) {
    this.outputs.forEach(cb => cb(data));
  }

  update () {
    // Override me.
  }

}

module.exports = Combiner;
