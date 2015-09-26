# Listings: the game


## notes:

--- broken:
switching to editor with keys down
dumping lights
ten different flippin event systems...
sensors don't un-listen.
----

* git messages could be clues
* thinkin' *Sneakers*, but with 85% less Robert Redford and 50% more *Hackers* (but like, legit).
* make things proc gen? and scriptable with ItsBasic
* everything in the world can be controlled with ItsBasic.
  name things?
* goal is not to teach BASIC: player should alwyas be out of their depth, and has no help from anyone else in the gaem. Fumbling always forward and learning stuff the hardest of hard ways.
* World can be controlled by BASIC - but also... moving things in the world could set memory locations in the computer!

## Rules engine? how could it work?

*** Just copy Blender idea...
Sensors -> Controllers -> Actuators

EG: Always sensor. The Always sensor is used for things that need to be done every logic tick, or at every x logic tick, or at start-up (with Tap).


var always5 = Always(5 ticks) ->
var always3 = Always(3 ticks) ->

cube
  : always3 -> |
               + -> toggle (20)
  : always5 -> |

  --- produces stream: fizzbuzz

Property sensor would be good: The Property sensor detect changes in the objects properties

class Sensor {}
class Always extends Sensor {
  constructor ()
}
//class Property extends Sensor()



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
