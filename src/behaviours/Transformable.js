function Transformable(c) {
  Object.defineProperties(c.prototype, {
    position: {
      get: function () { return this.mesh.position; },
      set: function (pos) { this.mesh.position.set(pos.x, pos.y, pos.z); }
    },
    rotation: {
      get: function () { return this.mesh.rotation; },
      set: function (rot) { this.mesh.position.set(rot.x, rot.y, rot.z); }
    },
    scale: {
      get: function () { return this.mesh.scale; },
      set: function (scale) { this.mesh.scale.set(scale.x, scale.y, scale.z); }
    }
  });

  return c;
}

module.exports = Transformable;
