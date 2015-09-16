const Game = require('./Game');

const game = new Game();

function loop () {
  requestAnimationFrame(loop);
  game.update();
}
loop();

window.game = game;
