function Fallable(c) {
  var vel = 0;
  var acc = 0;

  const fall = (dt) => {
    acc += 0.0005;
    vel += acc;
  };

  c.prototype.fall = function (falling, dt) {
    if (falling) {
      fall(dt);
      this.position.y -= vel;
    } else {
      vel = 0;
      acc = 0;
    }
  };

  return c;
}

module.exports = Fallable;
