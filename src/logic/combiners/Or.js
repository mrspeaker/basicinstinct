const Combiner = require('./Combiner');

class Or extends Combiner {

  constructor (...inputs) {
    // assert input length!
    super(inputs);

    this.flags = inputs.map((inp, i) => {
      inp.add(() => this.flags[i] = true);
      return false;
    });
  }

  update () {
    var allSet = false;
    this.flags = this.flags.map(f => {
      allSet |= f;
      return false;
    });
    if (allSet) {
      this.fire();
    }
  }

}

module.exports = Or;
