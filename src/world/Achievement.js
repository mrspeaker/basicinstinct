/*worldCreated -> listen(1)

1. helloWorld
init () =>
  OnProgRun: if (hellow world program) success!
  on success:
    ach.helloword.unloced = true;
    fire:
      add trigger to purgatory
      listen(2)
      unlisten(1)

2: gotToPurgatory
init () =>
  OnRoomChange: if (helloWolrd.ulocked) success!
  OnSuccess:
    this.unloked = true;
    fire:
      ach 3;
      unlisten2

3: changeScreenColorInPurgatory
inti () =>
  state: {inRoom: null}
  OnRoomChange: this.inRoom = room;
  OnProgRun: if (changescreencoll && this.inRoom === purg) success!


  Env.events.on('WorldCreated', () => {
    hw.start();
  });
  const hw = new Achievment(
    "Hello, World",
    () => {
      Env.events.on('programRun', () => {
        this.unlock();
      });
    },
    () => {
      // Remove listeners
    },
    () => {
      Env.events.emit('addItem', {trigger})
      Env.events.emit('listenAchievement', {name:'goToPurgatory'})
    }
  });

*/
class Achievement {
  constructor (name, listen, unlisten, success) {
    this.locked = true;
    this.state = {};
    this.name = name;
    this.listen = listen;
    this.unlisten = unlisten;
    this.success = success;
  }
  start () {
    this.listen.call(this);
  }
  unlock () {
    this.locked = false;
    this.unlisten();
    this.success();
  }
}

module.exports = Achievement;
