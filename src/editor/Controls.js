const Env = require('../Env');
const React = require('react');

const {Component} = React;

class Controls extends Component {

  save () {
    Env.events.emit("saveRoom");
  }

  render () {
    return <div>
      <button onClick={this.save}>save</button>
    </div>;

  }

}

module.exports = Controls;
