class Item {

  constructor () {
    this.ons = [];
  }

  fire (name, data) {
    console.log('unhandled', name, data);
  }

  update () {}

}

module.exports = Item;
