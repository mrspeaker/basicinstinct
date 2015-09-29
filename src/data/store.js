const store = {

  clear (name) {
    window.localStorage.removeItem(name);
  },

  loadRoom (name) {
    const ls = window.localStorage.getItem('room-' + name);
    console.log('from ls:', name);
    return JSON.parse(ls);
  },

  saveRoom (data) {
    console.log('saving to ls:', data.name);
    if (!data.name) {
      return;
    }
    const old = this.loadRoom(data.name);
    old.version = old.version || 1;
    data.version = old.version + 1;
    window.localStorage.setItem('room-' + data.name + '-' + old.version, JSON.stringify(old));
    window.localStorage.setItem('room-' + data.name, JSON.stringify(data));
  }

};

module.exports = store;
