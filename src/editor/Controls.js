const Env = require('../Env');
const React = require('react');

const {Component} = React;

class Controls extends Component {

  save () {
    console.log("herer....")
    Env.events.emit("saveRoom");
  }

  render () {
    return <div>
      <button onClick={this.save}>save</button>
      <span>PLAY</span>&nbsp;
      <span>DUMP</span><br/><br/>
    </div>;

  }

}

module.exports = Controls;
