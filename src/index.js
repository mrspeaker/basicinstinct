const React = require('react');
const Editor = require('./editor/Editor');
const Game = require('./Game');

/* All external things should be in Env */
const Env = require('./Env');
Env.dom = document.querySelector('#main #board');
Env.width = Env.dom.clientWidth;
Env.height = window.innerHeight;

const game = new Game();
game.events = Env.events;  // Used for editor to hook into game
window.worldBus = game.world.bus; // For computer interactin'
window.game = game; // global for testin'

window.dumpRoom = function () {
  console.log("saved to window._dump: copy(_dump); for clipboard.");
  const room = game.world.room;
  const {items} = room;
  const out = items.map(i => room.getDefn(i));
  window._dump = out;
  var jsony = JSON.stringify(out, (k, v) => {
    return v;
  }, 2);
  //console.log(jsony);
}

function loop () {
  requestAnimationFrame(loop);
  game.update();
}
Env.events.emit('start');
loop();

Env.dom.addEventListener('mouseenter', () => { game.world.hasFocus = true; }, false);
Env.dom.addEventListener('mouseleave', () => { game.world.hasFocus = false; }, false);

React.render(
  <Editor game={game} />,
  document.getElementById('sidebar')
);
