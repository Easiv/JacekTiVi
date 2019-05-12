import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  roomId: null,
  userList: null,

  init() {
    this._super(...arguments);

    this.store.findAll('user')
    .then(users => {
      let userList = users.filterBy('roomId', this.get('roomId'));
      this.set('userList', userList)
    });
  },

  actions: {
    success() {},

    error() {}
  }
});
