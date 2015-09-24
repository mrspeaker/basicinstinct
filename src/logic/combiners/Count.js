const Combiner = require('./Combiner');

class Count extends Combiner {

  constructor (input, upTo = 3, repeat = false) {
    // assert input length!
    super([input]);

    this.upTo = upTo;
    this.repeat = repeat;
    this.count = 0;

    input.add(() => this.plusOne());
  }

  plusOne () {
    this.count++;
    if (this.count === this.upTo) {
      this.fire();
      if (this.repeat) {
        this.count = 0;
      }
    }
  }

}

module.exports = Count;
