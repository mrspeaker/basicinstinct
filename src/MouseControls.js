const Env = require('./Env');

class MouseControls {

  constructor () {

    this.pos = {
      x: -1,
      y: -1,
      dx: 0,
      dy: 0
    };

    this.left = {
      _downAt: Date.now(),
      clicked: false, // press for < 300ms
      dragging: false, // press for > 300ms
      released: false
    };

    this.right = {
      _downAt: Date.now(),
      clicked: false, // press for < 300ms
      dragging: false, // press for > 300ms
      released: false
    };

    this.dom = Env.dom || document.body;
    this.bind();

  }

  update () {

    if (this.left.clicked) {
      this.left.clicked = false;
      this.left.released = true;
    }

    if (this.right.clicked) {
      this.right.clicked = false;
      this.right.released = true;
    }

    this.pos.dx = 0;
    this.pos.dy = 0;

  }

  bind () {
    const {dom} = this;
    dom.addEventListener('mousedown', e => this.mousedown(e), false);
    dom.addEventListener('mousemove', e => this.mousemove(e), false);
    dom.addEventListener('mouseup', e => this.mouseup(e), false);
    dom.addEventListener('mouseleave', e => this.mouseup(e), false);
  }

  mousedown (e) {
    this.pos.x = (e.clientX / Env.width) * 2 - 1;
    this.pos.y = -(e.clientY / Env.height) * 2 + 1;

    const rmb = e.which === 3;
    const obj = rmb ? this.right : this.left;
    obj._downAt = Date.now();
    obj.dragging = true;
  }

  mouseup (e) {
    const rmb = e.which === 3;
    const obj = rmb ? this.right : this.left;
    obj.dragging = false;

    if (Date.now() - obj._downAt < 300) {
      obj.clicked = true;
    }

  }

  mousemove (e) {
    e.preventDefault();
    const {x, y} = this.pos;
    this.pos.x = (e.clientX / Env.width) * 2 - 1;
    this.pos.y = -(e.clientY / Env.height) * 2 + 1;
    this.pos.dx = x - this.pos.x;
    this.pos.dy = y - this.pos.y;
  }

}

module.exports = MouseControls;
