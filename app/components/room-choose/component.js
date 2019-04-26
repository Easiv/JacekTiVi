import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  router: service(),

  actions: {
    createRoom() {
      this.get('store').createRecord('room').save().then(model => {
        this.get('router').transitionTo('room', model.id);
      })
    },

    findRoom(id) {
      if(id.trim()) {
        this.get('store').findRecord('room', id).then(
        this.get('router').transitionTo('room', id)).catch(() => {
          alert('Nie znaleziono pokoju');
        })
      } else {
        alert('Nie znaleziono pokoju');
      }
    }
  }
});
