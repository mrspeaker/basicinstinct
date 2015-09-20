const React = require('react');

const {Component} = React;

class SideBar extends Component {

  onChange (attr, index, e) {
    this.props.onChange(attr, index, e.currentTarget.value);
  }

  render () {
    const {selected} = this.props;

    if (!selected) { return <div>-</div>; }

    const {mesh} = selected;
    const {position:pos, rotation:rot, scale} = mesh;
    return (
      <div>
        <span>Type: {selected.type}. ID: {selected.id}</span><br/>
        <br/>
        pos&nbsp;
      <span>x<input value={pos.x} onChange={e => selected.onChange('pos', 'x', e.currentTarget.value)} /></span>
        <span> y<input value={pos.y} onChange={e => this.onChange('pos', 'y', e)}/></span>
        <span> z<input value={pos.z} onChange={e => this.onChange('pos', 'z', e)}/></span><br/>
        rot&nbsp;
        <span>x<input value={rot.x} /></span>
        <span> y<input value={rot.y} /></span>
        <span> z<input value={rot.z} /></span><br/>
        sc&nbsp;&nbsp;
      <span>x<input value={scale.x} /></span>
        <span> y<input value={scale.y} /></span>
        <span> z<input value={scale.z} /></span><br/>
        <hr />
      </div>
    );
  }
}

module.exports = SideBar;
