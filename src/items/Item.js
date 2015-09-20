class Item {

  constructor () {
    this.triggers = [];
    this.onChange = this.onChange.bind(this);

  }

  addTrigger () {

  }

  onChange (attr, index, value) {
    console.log("ima change...", attr, value);
    this[attr][index] = parseFloat(value);
  }

  // get pos () {
  //   return this.mesh.position;
  // }
  //
  // set pos ({x, y, z}) {
  //   this.mesh.position.set(x, y, z);
  // }

};

module.exports = Item;
