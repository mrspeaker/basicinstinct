# Listings: the game


## notes:

* git messages could be clues
* thinkin' *Sneakers*, but with 85% less Robert Redford and 50% more *Hackers* (but like, legit).
* make things proc gen? and scriptable with ItsBasic
* everything in the world can be controlled with ItsBasic.
  name things?
* goal is not to teach BASIC: player should alwyas be out of their depth, and has no help from anyone else in the gaem. Fumbling always forward and learning stuff the hardest of hard ways.
* World can be controlled by BASIC - but also... moving things in the world could set memory locations in the computer!

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

rule: event: 'WorldCreate', actions: 'GoToBedroom'

document.on('GoToLocation', (data) => {
  game.scene = new Room(data);
});

class Room(data) { trigger(data.name + 'RoomLoaded') }

event: 'BedroomLoaded',


```
onWorldCreated => add(ClassicAchievement)

1. ClassicAchievement: astIsClassic.
   [HP++, bedroomDoorOpens, remove(LockedBedroom), add(ClassicAchievement+)]

2. LockedBedroom: triggerDoor
   [msg("Not 'til you do your homework")]

3. ClassicAchievement+: astIsClassic + string is different
   [HP++]

4. AddQuizProg: triggerMag1
   [msg("has been added!"), addToGlobalProgBook(quizCode), add(QuizAchievement)]

5. QuizAchievement: astIsQuiz
   [HP+, triggerGlitchTeaser]
