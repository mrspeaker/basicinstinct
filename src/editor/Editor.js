const React = require('react');
const SideBar = require('./SideBar');

const {Component} = React;

class Editor extends Component {

  constructor (props) {
    super(props);

    this.state = {
      selected: null
    };

    props.game.events.on('selectionChange', s => {
      this.setState({selected:s});
    });
  }

  render () {
    return <SideBar selected={this.props.game.selected} />;
  }

}

module.exports = Editor;
