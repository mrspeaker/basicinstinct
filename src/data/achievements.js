const Env = require('../Env');
const Achievement = require('../world/Achievement');
const achievements = {};

/*
1. helloWorld
  OnProgRun: if (hellow world program) success!
  on success:
      add trigger to purgatory
      listen(gotToPurgatory)

2: gotToPurgatory
  OnRoomChange: if (helloWolrd.ulocked) success!
  OnSuccess: listent(changeScreenColorInPurgatory)

3: changeScreenColorInPurgatory
  state: {inRoom: null}
  OnRoomChange: this.inRoom = room;
  OnProgRun: if (changescreencoll && this.inRoom === purg) success!
*/

achievements.hw = new Achievement(
  "Hello, World",
  (onUnlock, state) => {
    state.count = 0;
    achievements.hw.listeners = [{
      name:'programEnded',
      func: () => {
        if (state.count++ > 3) {
          onUnlock();
        }
      }
    }].map(nf => {
      Env.events.on(nf.name, nf.func);
      return nf;
    });
  },
  () => achievements.hw.listeners.map(nf => {
    Env.events.removeListener(nf.name, nf.func);
  }),
  () => {
    //Env.events.emit('addItem', {trigger})
    Env.events.emit('achievement-init', 'goToPurgatory');
  }
);

achievements.goToPurgatory = new Achievement(
  "Go To Purgatory",
  (onUnlock) => {
    achievements.hw.listeners = [{name:'changeRoom', func: room => {
      if (room === 'purgatory') {
        onUnlock();
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
