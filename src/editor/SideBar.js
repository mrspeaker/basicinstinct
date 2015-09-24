const React = require('react');


const {Component} = React;

class SideBar extends Component {

  render () {
    const {selected} = this.props;

    if (!selected) { return <div></div>; }

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


    const col = selected.color === undefined ? null : (<input defaultValue={selected.color} onBlur={
      e => {
        const val = e.currentTarget.value;
        selected.color = val;
        selected.defn.args.color = parseInt(val, 16);
        this.forceUpdate();
      }
    } />);

    const ons = Object.keys(selected.ons).map(k => [k, selected.ons[k]]).map(([v, i]) => {
      return <div><div>{v}</div>{i.map(h => {
        return <input style={{width:300}} value={JSON.stringify(h)} />;
      })}</div>;
    });

    return (
      <div>
        {transforms}
        <hr />
        <textarea value={JSON.stringify(selected.defn.args)} /><br/>
        {ons}
        {col}
        <br/>
      </div>
    );
  }
}

module.exports = SideBar;
