# Listings: the game


## notes:

* git messages could be clues
* thinkin' *Sneakers*, but with 85% less Robert Redford and 50% more *Hackers* (but like, legit).
* make things proc gen? and scriptable with ItsBasic
* everything in the world can be controlled with ItsBasic.
  name things?


## Rules engine? how could it work?

class Rule {
  constructor (condition, action) {
    this.condition = condition;
    this.action = action;
  }

  exec () {
    if (this.condition()) this.action();
  }
}

const ifPlayerDead = () => {
  return player.health <= 0;
}
const removePlayerFromWorld = () => {
  world.remove(player);
}

const r = new Rule(ifPlayerDead, removePlayerFromWorld)

r.exec();

####

Things in game...

* player

* program. onload, onparse, onstart, onbreak?
  * hasAST, assertIsTrue...

  if(assertIsTrue(prog, x=1))...

if Player enters bedroom
  * if has diskDriveInInventory -> addDiskDriveToComputer;removeDiskDriveFromINventory.

```js
document.onload = trigger('WorldCreate');

rule: {
  event: 'WorldCreate',
  actions: [{
    trigger: 'GoToLocation',
    data: 'Bedroom'
  }]
}

document.on('GoToLocation', (data) => {
  game.scene = new Room(data);
});

class Room(data) { trigger('?BedroomRoomLoaded', room);}

rule: {
  event: 'BedroomLoaded',
  condition: 'player' 'Has' 'DiskDrive'
  actions: [{
    doEvent 'AddItem', 'DiskDrive', 'Bedroom'
    doEvent 'RemoveItem', 'DiskDrive', 'Player'
  }]
};


```
