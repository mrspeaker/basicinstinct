const MouseControls = require('./MouseControls');
const KeyControls = require('./KeyControls');

module.exports = () => ({
  mouse: new MouseControls(),
  keys: new KeyControls()
});
