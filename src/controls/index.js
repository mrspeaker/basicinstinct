/* @flow */

const MouseControls = require('./MouseControls');
const KeyControls = require('./KeyControls');

class Controls {
  mouse: MouseControls;
  keys: KeyControls;
  constructor () {
    this.mouse = new MouseControls();
    this.keys = new KeyControls();
  }
}

module.exports = Controls;
