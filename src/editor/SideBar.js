const React = require('react');

const {Component} = React;

class SideBar extends Component {

  render () {
    const {selected} = this.props;

    if (!selected) { return <div>-</div>; }

    const {position:pos, rotation:rot, scale} = selected.mesh;
    const ts = {pos, rot, scale};

    const transforms = ['pos', 'rot', 'scale'].reduce((all, t) => {
      const transform = ts[t];
      all.push(<span>{t}&nbsp;</span>);

      ['x', 'y', 'z'].forEach(a => {
        all.push(
          <span>
            {a}
            <input value={transform[a]} onChange={
              e => {
                const val = e.currentTarget.value;
                transform[a] = t === 'scale' && val === 0 ? 0.001 : val;
                this.forceUpdate();
              }
            } />
          </span>
        );
      });
      all.push(<br/>);
      return all;
    }, []);

    return (
      <div>
        <span>Type: {selected.type}. ID: {selected.id}</span><br/>
        <br/>
        {transforms}
        <hr />
        <textarea value={JSON.stringify(selected.defn.args)} />
      </div>
    );
  }
}

module.exports = SideBar;
