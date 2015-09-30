const React = require('react');
const SideBar = require('./SideBar');
const Controls = require('./Controls');
const Env = require('../Env');

const {Component} = React;

class Editor extends Component {

  constructor (props) {
    super(props);

    this.state = {
      selected: null
    };

    Env.events.on('selectionChange', s => {
      this.setState({selected:s});
    });

    Env.events.on('itemSelected', s => {
      this.setState({selected:s});
    });
  }

  render () {

    const {selected} = this.state;
    const {game} = this.props;
    const {world} = game;
    const {room} = world;

    const type = selected ? selected.type : "-";
    const id = selected ? selected.id : "-";
    const name = selected ? selected.name : "-";

    return <div>
      <span>{room.name} {room.version}</span><br/>
      <Controls />
      <hr />
      <span>Type: {type}. ID: {id}.</span><br/>
      <div><input value={name} /></div>
      <br/>
      <SideBar selected={this.state.selected} />
      <div>
        <br/>
        <strong>Notes:</strong>
        <div>
          <strong>backtick key:</strong> switches between Player and Editor.<br/>
          In Player mode you can type on puter. <br/>
          In Editor mode it pushes things around (shift moves things faster).<br/>
        </div>
        <div>1/2/3 keys switch between modes: pos, rot, scale.</div>
        <div>z key duplicates current selected</div>
      </div>
    </div>;
  }

}

module.exports = Editor;
