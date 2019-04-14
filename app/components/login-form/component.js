import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  actions: {
    createUser(name) {
      this.get('store').createRecord('user', {
        name,
        isAuthenticated: false,
        isVip: false
      }).save()
    }
  }
});
