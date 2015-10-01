/* @flow */
const React = require('react');
const Editor = require('./editor/Editor');
const Game = require('./Game');

/* All external things should be in Env */
const Env = require('./Env');
Env.dom = document.querySelector('#main #board');
Env.width = Env.dom.clientWidth;
Env.height = window.innerHeight;

const game = new Game();
window.game = game; // global for testin'

window._dumpRoom = function () {
  console.log("saved to window._dump: copy(_dump); for clipboard.");
  const room = game.world.room;
  const {items} = room;
  const out = items.map(i => room.getDefn(i));
  window._dump = out;
};

function loop () {
  window.requestAnimationFrame(loop);
  // TODO: fixed update/delta
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
