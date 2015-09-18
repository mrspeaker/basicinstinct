const Game = require('./Game');

const game = new Game();
window.worldBus = game.bus;

function loop () {
  requestAnimationFrame(loop);
  game.update();
}
loop();

window.game = game;
