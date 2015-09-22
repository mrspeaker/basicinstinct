class KeyControls {

  constructor () {

    this.keys = {};
    this.pressed = [];

    this.move = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false,
      shift: false
    };

    this.bind();
  }

  bind () {
    document.body.addEventListener('keydown', e => {
      const {which} = e;

      if ([8, 191, 32].indexOf(which) > -1) {
        e.preventDefault();
      }

      this.keys[which] = {
        down: true,
        pressed: true,
        released: false
      };
      this.pressed.push(e);

      if (e.shiftKey) this.move.shift = true;
      // WSAD / Keys
      if (which === 38 || which === 87) { this.move.forward = true; }
      if (which === 40 || which === 83) { this.move.backward = true; }
      if (which === 37 || which === 65) { this.move.left = true; }
      if (which === 39 || which === 68) { this.move.right = true; }
      if (which === 81) { this.move.up = true; }
      if (which === 69) { this.move.down = true; }

    }, false);

    document.body.addEventListener('keyup', e => {
      const {which} = e;

      this.keys[which] = {
        down: false,
        pressed: false,
        released: false
      };

      if (!e.shiftKey) this.move.shift = false;
      const forward = which === 38 || which === 87;
      const backward = which === 40 || which === 83;
      const left = which === 37 || which === 65;
      const right = which === 39 || which === 68;
      const up = which === 81;
      const down = which === 69;
      if (forward) { this.move.forward = false; }
      if (backward) { this.move.backward = false; }
      if (left) { this.move.left = false; }
      if (right) { this.move.right = false; }
      if (up) { this.move.up = false; }
      if (down) { this.move.down = false; }
    }, false);
  }

  update () {
    this.pressed = this.pressed.filter(p => {
      p.pressed = false;
      p.released = true;
    });
  }

}

module.exports = KeyControls;
