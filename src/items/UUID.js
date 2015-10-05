var id = 1;
module.exports = {
  get id () { return ++id; },
  set id (i) { id = i; }
};
