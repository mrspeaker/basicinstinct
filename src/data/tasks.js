const Env = require('../Env');
const Task = require('../world/Task');
const tasks = {};

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

tasks.hw = new Task(
  "Hello, World",
  (onUnlock, state) => {
    state.count = 0;
    tasks.hw.listeners = [{
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
  () => tasks.hw.listeners.map(nf => {
    Env.events.removeListener(nf.name, nf.func);
  }),
  () => {
    //Env.events.emit('addItem', {trigger})
    Env.events.emit('popup', "Multi-run!");
    Env.events.emit('task-init', 'goToPurgatory');
  }
);

tasks.goToPurgatory = new Task(
  "Go To Purgatory",
  (onUnlock) => {
    tasks.hw.listeners = [{name:'changeRoom', func: room => {
      if (room === 'purgatory') {
        onUnlock();
      }
    }}].map(nf => {
      Env.events.on(nf.name, nf.func);
      return nf;
    });
  },
  () => tasks.hw.listeners.map(nf => {
    Env.events.removeListener(nf.name, nf.func);
  }),
  () => {
    Env.events.emit('popup', '@nd task get:<br/>Entered purgatory.');
  }
);

module.exports = tasks;
