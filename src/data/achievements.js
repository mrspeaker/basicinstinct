const Env = require('../Env');
const Achievement = require('../world/Achievement');
const achievements = {};

achievements.hw = new Achievement(
  "Hello, World",
  function () {
    achievements.hw.listeners = [{name:'programEnded', func: a => {
      if (a.len === 2) {
        this.unlock();
      }
    }}].map(nf => {
      Env.events.on(nf.name, nf.func);
      return nf;
    });
  },
  () => achievements.hw.listeners.map(nf => {
    Env.events.removeListener(nf.name, nf.func);
  }),
  () => {
    alert("Achievement get!");
    achievements.goToPurgatory.start();
    //Env.events.emit('addItem', {trigger})
    //Env.events.emit('listenAchievement', {name:'goToPurgatory'})
  }
);

achievements.goToPurgatory = new Achievement(
  "Go To Purgatory",
  function () {
    achievements.hw.listeners = [{name:'programEnded', func: a => {
      if (a.len === 3) {
        this.unlock();
      }
    }}].map(nf => {
      Env.events.on(nf.name, nf.func);
      return nf;
    });
  },
  () => achievements.hw.listeners.map(nf => {
    Env.events.removeListener(nf.name, nf.func);
  }),
  () => {
    alert("@nd Achievement get");
  }
);

module.exports = achievements;
