/* @flow */
const {THREE} = require('three');
const {Raycaster, Object3D, Vector3} = THREE;
const Item = require('../items/Item');

const caster = new Raycaster();

type Hit = {object:Item, point:Vector3, distance: number};

function raycaster(children:Array<Object3D>, origin:?Object3D, direction:Vector3): Array<Hit> {

  if (origin) {
    if (direction.type === "PerspectiveCamera") {
      caster.setFromCamera(origin, direction);
    } else {
      caster.set(origin, direction);
    }
  }

  return caster
    .intersectObjects(children, true)
    .map(({point, distance, object}) => {
      return {
        object: object.userData.inst || object.parent.userData.inst,
        point,
        distance
      };
    })
    .filter(i => !!i);
}

module.exports = raycaster;
