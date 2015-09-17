const Game = require('./Game');

const game = new Game();
window.worldBus = game.bus;

function loop () {
  requestAnimationFrame(loop);
  game.update();
}
loop();

// helperere! Get rid of this and replace with point'n'click.

window.game = game;

const selRoom = 'bedroom';
const update = (attr, i, val, blnSet) => {
  const sel = window.sel;
  if (!sel) {
    console.log('set an item to "sel"');
    return;
  }
  sel[attr] = sel[attr] || [0, 0, 0];

  if (blnSet) {
    sel[attr][i] = val;
  } else {
    sel[attr][i] += val;
  }
  game.loadRoom(window.DATA[selRoom]);
};

window.addItem = (name) => {
  const n = {
    type: name
  };
  window.DATA[selRoom].items.push(n);
  game.loadRoom(window.DATA[selRoom]);
  window.sel = n;
  return n;
};

window.posX = (val, blnSet) => update('pos', 0, val, blnSet);
window.posY = (val, blnSet) => update('pos', 1, val, blnSet);
window.posZ = (val, blnSet) => update('pos', 2, val, blnSet);

window.rotX = (val, blnSet) => update('rot', 0, val, blnSet);
window.rotY = (val, blnSet) => update('rot', 1, val, blnSet);
window.rotZ = (val, blnSet) => update('rot', 2, val, blnSet);


const copyItem = (id, attr) => {
  const sel = window.sel;
  if (!sel || !selRoom) {
    console.log('set an item to "sel" and "selRoom"');
    return;
  }
  sel[attr] = window.DATA[selRoom].items[id][attr].slice();
  game.loadRoom(window.DATA[selRoom]);
};
window.copyPos = (id) => copyItem(id, 'pos');
window.copyRot = (id) => copyItem(id, 'rot');
window.copyScale = (id) => copyItem(id, 'scale');
