const React = require('react');
const Editor = require('./editor/Editor');
const Game = require('./Game');

/* All external things should be in Env */
const Env = require('./Env');
Env.dom = document.querySelector('#main');
Env.events.emit('mousedown');

const game = new Game(document.querySelector('#main'));

window.worldBus = game.bus; // For computer interactin'
window.game = game; // For testin'

function loop () {
  requestAnimationFrame(loop);
  game.update();
}
loop();

React.render(
  <Editor game={game} />,
  document.getElementById('sidebar')
);
